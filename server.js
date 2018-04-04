const fs = require('fs')
const express = require('express')
const serveStatic = require('serve-static')
const http = require('http')
const https = require('https')
const app = express()
const _ = require('underscore')
const path = require('path')
const exec = require('child_process').exec
const config = require('./config')
const bodyParser = require('body-parser')
// app.use(serveStatic('dist/', { 'index': ['index.html'] }))

app.use(bodyParser.json())

app.get('/config', (req, res) => {
  res.send(config)
})

const namespaces = {
  pttgfsdev: {
    label: 'pttg-fs-dev',
    name: 'pttg-fs-dev'
  }
}

const execCmd = (cmd) => {
  console.log(cmd)
  return new Promise((resolve, reject) => {
    exec(cmd, {maxBuffer: 1024 * 2048}, (error, stdout, stderr) => {
      if (error) {
        console.log('ERROR', error)
        return reject(error)
      }
      try {
        var json = JSON.parse(stdout)
        return resolve(json)
      } catch (e) {
        // console.log('CAUGHT', e)
        return resolve({raw: stdout})
      }
    })
  })
}

const stdCmdAndResponse = (res, cmd, postProcess) => {
  res.setHeader('Content-Type', 'application/json')
  execCmd(cmd)
    .then((result) => {
      res.send((postProcess) ? postProcess(result) : result)
    })
    .catch((e) => {
      res.statusCode = 500
      res.send({error: e})
    })
}

// app.get('/api/namespace', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   res.send(_.values(namespaces))
// })

app.get('/api/context/:con/namespace/:ns/quota', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get resourcequota -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result.items[0].status
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
    return result.items
  })
})

app.post('/api/context/:con/namespace/:ns/deployments/:dep', (req, res) => {
  console.log(req.body)
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
    return result.items
  })
})

app.get('/api/context/:con/namespace/:ns/configmaps', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get configMaps -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result.items
  })
})

app.get('/api/context/:con/namespace/:ns/pods', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} get pods -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result.items
  })
})

app.get('/api/context/:con/namespace/:ns/pods/:id/describe', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} describe pod ${req.params.id} -o=json --namespace=${req.params.ns}`
  stdCmdAndResponse(res, cmd, (result) => {
    return result.items
  })
})

app.get('/api/context/:con/namespace/:ns/pods/:id/log/:container', (req, res) => {
  const cmd = `kubectl --context=${req.params.con} logs ${req.params.id} -n ${req.params.ns} -c ${req.params.container}`
  stdCmdAndResponse(res, cmd, (result) => {
    var data = []
    var lines = result.raw.split('\n')
    var lineJson
    _.each(lines, (l) => {
      try {
        lineJson = JSON.parse(l)
        data.push(lineJson)
      } catch (e) {
        if (l.length) {
          let prevMsg = _.last(data)
          if (prevMsg && prevMsg.msg) {
            prevMsg.msg.push(l)
          } else {
            data.push({msg: [l]})
          }
        }
      }
    })
    return {lines: data}
  })
})

// app.get('/api/namespace/:namespace/pod/:pid/container/:container/log', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   KubeService.getLog(req.params.namespace, req.params.pid, req.params.container).then((result) => {
//     res.send(result)
//   }, function (error) {
//     res.statusCode = 500
//     res.send({error: error})
//   })
// })

// app.get('/api/namespace/:namespace/pod/:pid/container/:container/health', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   KubeService.getHealth(req.params.namespace, req.params.pid, req.params.container).then((result) => {
//     res.send(result)
//   }, function (error) {
//     res.statusCode = 500
//     res.send({error: error})
//   })
// })

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(process.env.PORT || 9998, () => {
  console.log('The server is running')
})
