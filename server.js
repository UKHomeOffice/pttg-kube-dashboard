
const express = require('express')
const app = express()
const _ = require('underscore')
const path = require('path')
const exec = require('child_process').exec
const config = require('./config')
const bodyParser = require('body-parser')
const helm = require('./helm')

app.use(bodyParser.json())

app.get('/config', (req, res) => {
  res.send(config)
})

const randPass = () => {
  var pwdChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var pwdLen = 20
  return Array(pwdLen).fill(pwdChars).map(x => x[Math.floor(Math.random() * x.length)]).join('')
}

const logLineParse = (l) => {
  let lineJson = null
  try {
    lineJson = JSON.parse(l)
    return lineJson
  } catch (e) {
    lineJson = null
  }

  if (!l.length) return null

  return {msg: l}
}

helm.init()

const execCmd = (cmd) => {
  console.log(cmd)
  return new Promise((resolve, reject) => {
    exec(cmd, {maxBuffer: 1024 * 2048}, (error, stdout, stderr) => {
      if (error) {
        console.log('ERROR', error)
        error.stdout = stdout
        error.stderr = stderr
        return reject(error)
      }
      try {
        var json = JSON.parse(stdout)
        return resolve(json)
      } catch (e) {
        // console.log('CAUGHT', e)
        return resolve({ raw: stdout, error: e })
      }
    })
  })
}

const stdCmdAndResponse = (res, cmd, postProcess) => {
  res.setHeader('Content-Type', 'application/json')
  execCmd(cmd)
    .then((result) => {
      result.__cmd = cmd
      res.send((postProcess) ? postProcess(result) : result)
    })
    .catch((e) => {
      res.statusCode = 500
      res.send({error: e})
    })
}

app.get('/api/context/:con/helm', (req, res) => {
  let versions = helm.getHelmVersions(req.params.con)
  if (versions) {
    res.send(versions)
    return
  }
  res.send({})
})

app.get('/api/context/:con/namespace/:ns/quota', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get resourcequota -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return {
      status: result.items[0].status,
      __cmd: result.__cmd
    }
  })
})

app.get('/api/context/:con/namespace/:ns/ingress', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get ingress -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.get('/api/context/:con/namespace/:ns/deployments', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get deployments -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.post('/api/context/:con/namespace/:ns/deployments/:dep/deploy', (req, res) => {
  let project = req.params.dep
  let build = req.body.build
  let version = req.body.version
  let env = req.body.env

  if (build && env) {
    const cmd = `drone -s ${config.drone.server} -t ${config.drone.token} deploy -p IMAGE_VERSION=${build} UKHomeOffice/${project} ${version} ${env}`
    stdCmdAndResponse(res, cmd, (result) => {
      return result
    })
  } else {
    res.status(500)
    res.send()
  }
})

app.post('/api/context/:con/namespace/:ns/deployments/:dep/scale', (req, res) => {
  let rep = Number(req.body.scale)
  if (rep >= 0) {
    const cmd = `kubectl --context=${req.params.con} -n=${req.params.ns} scale deployment ${req.params.dep} --replicas=${rep}`
    stdCmdAndResponse(res, cmd, (result) => {
      return result
    })
  } else {
    res.status(500)
    res.send()
  }
})

app.get('/api/context/:con/namespace/:ns/secrets', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get secrets -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.get('/api/context/:con/namespace/:ns/configmaps', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get configMaps -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.get('/api/context/:con/namespace/:ns/events', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get events -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.get('/api/context/:con/namespace/:ns/jobs', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get jobs -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.get('/api/context/:con/namespace/:ns/pods', (req, res) => {
  // get the events
  const ecmd = `kubectl --context=${req.params.con} get events -o=json --namespace=${req.params.ns}`
  execCmd(ecmd).then((events) => {
    let podEvents = {}
    _.each(events.items, (evt) => {
      if (evt.involvedObject.kind !== 'Pod') {
        // only interested in Pod events
        return
      }

      if (!_.has(podEvents, evt.involvedObject.name)) {
        // group the events by pod name
        podEvents[evt.involvedObject.name] = []
      }
      podEvents[evt.involvedObject.name].push(evt)
    })

    const cmd = `kubectl --context=${req.params.con} get pods -o=json --namespace=${req.params.ns}`
    stdCmdAndResponse(res, cmd, (result) => {
      // find the events related to each pod and set events proprty
      _.each(result.items, pod => {
        pod.events = _.has(podEvents, pod.metadata.name) ? podEvents[pod.metadata.name] : []
      })
      return result
    })
  })
})

app.get('/api/context/:con/namespace/:ns/pods/:id/describe', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} describe pod ${req.params.id} -n=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result
  })
})

app.get('/api/context/:con/namespace/:ns/pods/:id/log/:container', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} logs ${req.params.id} -n ${req.params.ns} -c ${req.params.container} --limit-bytes=` + 1024 * 2048
  stdCmdAndResponse(res, cmd, (result) => {
    var data = []
    var lines = result.raw.split('\n')
    var lineJson
    _.each(lines, (l) => {
      let entry = logLineParse(l)
      if (entry) {
        data.push(entry)
      }
      // try {
      //   lineJson = JSON.parse(l)
      //   data.push(lineJson)
      // } catch (e) {
      //   if (l.length) {
      //     data.push(l)
      //     // let prevMsg = _.last(data)
      //     // if (prevMsg && prevMsg.msg) {
      //     //   prevMsg.msg.push(l)
      //     // } else {
      //     //   data.push({msg: [l]})
      //     // }
      //   }
      // }
    })
    return {lines: data, __cmd: cmd}
  })
})

app.get('/api/htpasswd', (req, res) => {
  let users = req.query.users.split(',')
  let output = ''
  let data = ''
  let nxt = () => {
    let u = users.shift()
    let p = randPass()// 'password1'
    let up = `${u}:${p}`
    console.log(up)
    let up64 = Buffer.from(up).toString('base64')
    data += `  ${u}: '${up64}'\n`
    execCmd(`htpasswd -bn ${u} ${p}`).then(result => {
      console.log(result.raw)
      output += result.raw.trim() + '\n'
      if (users.length) {
        nxt()
      } else {
        let b64 = Buffer.from(output).toString('base64')
        res.send(`<pre>apiVersion: v1
kind: Secret
metadata:
  name: pttg-audit-service-secrets
data:
  .htpasswd_1: '${b64}'
${data}
</pre>`)
      }
    })
  }
  nxt()
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(process.env.PORT || 9998, () => {
  console.log('The server is running')
})
