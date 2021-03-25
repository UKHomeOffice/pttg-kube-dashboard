exports = module.exports = {
  projects: [
    {
      name: 'RPS',
      ref: 'rps',
      environments: [
        {
          context: 'ebsa-dev',
          namespace: 'dev-i-cust-pt',
          name: 'dev'
        },
        {
          context: 'ebsa-dev1',
          namespace: 'ho-it-dev1-i-cust-ptg',
          name: 'dev1'
        },
        {
          context: 'ebsa-dev2',
          namespace: 'ho-it-dev2-i-cust-ptg',
          name: 'dev2'
        },
        {
          context: 'ebsa-dev3',
          namespace: 'ho-it-dev3-i-cust-ptg',
          name: 'dev3'
        },
        {
          context: 'ebsa-feat',
          namespace: 'feat-i-cust-pt',
          name: 'feat'
        },
        {
          context: 'ebsa-feat1',
          namespace: 'ho-it-feat1-i-cust-ptg',
          name: 'feat1'
        },
        {
          context: 'ebsa-feat2',
          namespace: 'ho-it-feat2-i-cust-ptg',
          name: 'feat2'
        },
        {
          context: 'ebsa-feat3',
          namespace: 'ho-it-feat3-i-cust-ptg',
          name: 'feat3'
        },
        {
          context: 'ebsa-autosit',
          namespace: 'asitcust-i-cust-pt',
          name: 'asit'
        },
        {
          context: 'ebsa-bsit',
          namespace: 'ho-it-bsit-i-cust-ptg',
          name: 'bsit'
        },
        {
          context: 'ebsa-csit',
          namespace: 'ho-it-csit-i-cust-ptg',
          name: 'csit'
        },
        {
          context: 'ebsa-trn1',
          namespace: 'ho-it-trn1-i-cust-ptg',
          name: 'trn1'
        },
        {
          context: 'ebsa-can',
          namespace: 'eueican1',
          name: 'canary'
        },
        {
          context: 'rps-enquiry-prod',
          namespace: 'pttg-rps-enquiry-pr',
          name: 'prod-acp-enquiry'
        },
        {
          context: 'ebsa-prod',
          namespace: 'prod-i-cust-pt',
          name: 'prod'
        }
      ]
    },
    {
      name: 'Income Proving Service',
      ref: 'ips',
      environments: [
        {
          context: 'ip-dev',
          namespace: 'pttg-ip-dev',
          name: 'dev'
        },
        {
          context: 'ip-test',
          namespace: 'pttg-ip-test',
          name: 'test'
        },
        {
          context: 'ip-preprod',
          namespace: 'pttg-ip-preprod',
          name: 'preprod'
        },
        {
          context: 'ip-prod',
          namespace: 'pttg-ip-pr',
          name: 'prod'
        }
      ]
    },
    {
      name: 'Enquiry Form',
      ref: 'enquiry',
      environments: [
        {
          context: 'rps-enquiry-dev',
          namespace: 'pttg-rps-enquiry-dev',
          name: 'dev'
        },
        {
          context: 'rps-enquiry-test',
          namespace: 'pttg-rps-enquiry-test',
          name: 'test'
        },
        {
          context: 'rps-enquiry-prod',
          namespace: 'pttg-rps-enquiry-pr',
          name: 'prod'
        }
      ]
    }
  ],
  environmentColours: {
    dev: 'lime',
    test: 'yellow',
    prod: 'pink'
  }
}
