# Kubernetes dashboard #

`npm install`

Connect to VPN

Add details of contexts and namespaces to `config.js`

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
```

`npm start`

`node server.js`