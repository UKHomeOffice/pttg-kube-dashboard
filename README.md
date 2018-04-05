# Kubernetes dashboard #

`npm install`

Connect to VPN

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