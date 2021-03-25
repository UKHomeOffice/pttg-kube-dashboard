# Kubernetes dashboard #

## Pre-requisites ##

- Kube tokens for the environments you wish to view
- Connection to the relevant VPNs


## Install ##

`npm install`


### by Context ###

Your namespaces and contexts can be defined by context, by project or both. By context is a simple set of context - namespace definitions.

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


### by Project ###

You can also define your contexts and namespaces as project specific environments, such that you can specify a project and then the order in which your deploy pipeline works.

```
  projects: [
    {
      name: 'My project name',
      ref: 'proj',
      environments: [
        {
          context: 'not_prod_context',
          namespace: 'namespace-dev',
          name: 'dev'
        },
        {
          context: 'not_prod_context',
          namespace: 'namespace-test',
          name: 'test'
        },
        {
          context: 'prod_context',
          namespace: 'namespace-prof',
          name: 'prod'
        }
      ]
    }
  ]
```


#### Colour coding ####

To better highlight which environment you're working with each environment is colour-coded keyed from the environment name.

By default `dev` is `lime`, `test` is `yellow` and `prod` is `pink`

There are 7 colours available, they are...

- lime
- cyan
- purple
- yellow
- orange
- pink
- red

You can map environment labels to colours by adding a config section called `environmentColours` for example to change the default for test to `cyan` and `prod` to `red`

```
  environmentColours: {
    dev: 'lime',
    test: 'cyan',
    prod: 'red'
  }
```


## Start ##

`npm start`


## Drone integration ##

Add details of your drone server and token to the `config.js` file, if you want to enable deployment between environments.

Currently the assumed deployment process is `namespace_dev` to `namespace_test` to `namespace_pr`.

```
  drone: {
    server: 'https://drone.acp.homeoffice.gov.uk',
    token: 'yourDRONEtokenGoesHere'
  },
```


## Helm integration ##
n
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

