# Modify package.json

```
  "dependencies": {
    "@sap/cds": "^3",
    "@sap/cds-mtx": "git://github.com/andrewlunde/cds-mtx.git",
    "@sap/hdi-deploy": "^3",
    "@sap/instance-manager": "^2",
    "passport": "^0.4.1",
    "@sap/xssec": "^2.2.0",
    "express": "^4.17.1",
    "hdb": "^0.17.2"
  },

...

  "scripts": {
    "postinstall": "npm dedupe && node .build.js",
    "xstart": "node ./node_modules/@sap/cds/bin/cds.js serve gen/csn.json",
    "start": "node server.js",
    "watch": "nodemon -w . -i node_modules/**,.git/** -e cds -x npm run build"
  },

  "private": true,
  "cds": {
    "requires": {
      "db": {
        "kind": "hana",
        "model": "gen/csn.json",
        "multiTenant": true,
        "vcap": {
          "label": "managed-hana"
        }
      }
    },
    "uaa": {
      "kind": "xsuaa"
    }
  }

```

# Modify ../xs-security.json

```
  "tenant-mode": "shared",
```
# Modify ../mta.yaml by uncommenting these blocks

```
# CDS-MTX
#   properties:
#      TENANT_HOST_PATTERN: '^(.*).<%= domain_name %>'

# CDS-MTX
#    - name: <%= app_name %>-reg
#    - name: <%= app_name %>-mgd

# CAP-MTX Managed HANA (Internal Service Manager)
#  - name: <%= app_name %>-mgd
#    type: org.cloudfoundry.managed-service
#    requires:
#     - name: <%= app_name %>_srv_api
#    parameters:
#       service-plan: hdi-shared
#       service: managed-hana
#       service-name: <%= app_name %>_MGD

# CAP-MXT Registration
#  - name: <%= app_name %>-reg
#    type: org.cloudfoundry.managed-service
#    requires:
#     - name: <%= app_name %>-uaa
#    parameters:
#     service: saas-registry
#     service-plan: application
#     service-name: <%= app_name %>_REG
#     config:
#       xsappname: ~{<%= app_name %>-uaa/XSAPPNAME}
#       appName: <%= app_name %>
#       displayName: <%= app_name %>
#       description: '<%= app_name %> Multitenant App'
#       category: '<%= app_name %> Category'
#       appUrls:
#          onSubscription: https://<%= app_name %>-srv-${space}.<%= domain_name %>/mtx/v1/provisioning/tenant/{tenantId}

```