const fs = require('fs-extra')
const simpleGit = require('simple-git/promise')
const path = require('path')
const config = require('./config')
const _ = require('underscore')

let helmData = {}

const helm = {
  init: () => {
    helmData = {}
    _.each(config.contexts, cxt => {
      if (cxt.helm && cxt.helm.repo) {
        helm.initGitRepo({
          url: cxt.helm.repo,
          project: cxt.helm.project,
          cxt: cxt.name
        })
      }
    })
  },

  initGitRepo: (settings) => {
    let url = settings.url
    let reponame = path.basename(url, '.git')
    let dirname = path.join(config.cache, reponame)
    fs.mkdirsSync(dirname)

    let git = simpleGit(dirname)

    git.checkIsRepo().then(isRepo => {
      return (isRepo) ? true : git.init(false)
    }).then(result => {
      return git.getRemotes(true)
    }).then(remotes => {
      return (remotes.length && remotes[0].refs.fetch === url) ? true : git.addRemote('origin', url)
    }).then(result => {
      return git.pull('origin', 'master')
    }).then(result => {
      helm.readHelmVersions(settings)
      console.log(helmData)
    }).catch(err => {
      console.log('ERR', err)
    })
  },

  readHelmVersions: (settings) => {
    let url = settings.url
    let reponame = path.basename(url, '.git')
    let dirname = path.join(config.cache, reponame)
    let dirs = fs.readdirSync(path.join(dirname, settings.project, 'charts'))
    helmData[settings.cxt] = {}
    _.each(dirs, d => {
      let file = fs.readFileSync(path.join(dirname, settings.project, 'charts', d, 'values.yaml'), 'utf8')
      let hash = file.replace(/shortHash: '(.+)'.*/i, '$1').trim()
      helmData[settings.cxt][d] = hash
    })
    return helmData
  },

  getHelmVersions: (cxt) => {
    if (_.has(helmData, cxt)) {
      return helmData[cxt]
    }
    return null
  }
}

exports = module.exports = helm
