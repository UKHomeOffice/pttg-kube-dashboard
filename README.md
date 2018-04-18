# Kubernetes dashboard #

## Pre-requisites ##

- Kube tokens for the environments you wish to view
- Connection to the relevant VPNs


## Install ##

`npm install`

Add details of contexts and namespaces to `config.js`, these details must match your contexts as named in your `~/.kube/config` file, you must have the appropriate kube tokens available on your system.

```
exports = module.exports = {
  contexts: [
    {
      name: 'context1',
      namespaces: [
        'namespace1',
        'namespace2'
      ]
    },
    {
      name: 'context2',
      namespaces: [
        'namespace3',
        'namespace4'
      ]
    }
  ]
}
```

`npm start`


## Helm integration ##

This app will checkout a Helm repo into a cache directory of your choosing and compare versions of pod containers with the values specified by Helm.

### Step 1: Cache directory ###

Create the cache directory and specify it in the `config.js` file. This cache directory must NOT created inside any git project including this. 

```
exports = module.exports = {
  cache: '/my-temporary-stuff/kube-dashboard-cache',
  contexts: [
    {
      name: 'context1',
```

### Step 3: Repo url and project details ###

Add a `helm` entry to the context to which it applies with keys `repo` and `project`, eg

```
{
  name: 'context-with-helm',
  namespaces: [
    'namespace1',
    'namespace2',
  ],
  helm: {
    repo: 'ssh://git@bitbucket.com/my-helm-repo.git',
    project: 'eue-api-project'
  }
}
```

Where `repo` is the url of the Helm project

and `project` is the directory within that contains the `charts` directory.

