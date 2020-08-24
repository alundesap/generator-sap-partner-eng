{
  "name": "<%= app_name %>-srv",
  "description": "Generated from ../package.json, do not change!",
  "version": "1.0.0",
  "engines": {
    "node": ">=8.0.0 <11.0.0"
  },
  "saved_deps": {
    "@sap/cds": "latest",
    "@sap/cds-mtx": "git://github.wdf.sap.corp/I830671/cds-mtx.git#e2dd61a19e7e7e02ecd25ca93c545dc34836d0e6",
    "@sap/instance-manager": "2.1.0",
    "other": "latest"
  },
  "external_deps": {
    "@sap/cds-mtx": "git://github.com/andrewlunde/cds-mtx.git#fix/suburl",
    "@sap/instance-manager": "git://github.com/andrewlunde/node-instance-manager#poc-sm",
    "other": "latest"
  },
  "deploy_deps3": {
    "@sap/cds": "3.34.2",
    "@sap/cds-mtx": "1.0.13",
    "@sap/instance-manager": "^2.2",
    "other": "not_latest_but_working"
  },
  "deploy_deps4": {
    "@sap/cds": "^4",
    "@sap/cds-mtx": "1.0.16",
    "@sap/instance-manager": "^2.2",
    "other": "latest_but_not_working"
  },
  "push_deps": {
    "push_cmd": "cd srv ; npm install --production ; cd .. ; cf push mtxsm-srv -p srv -n conciletime-dev-mtxsm-srv -d cfapps.us10.hana.ondemand.com -k 1024M -m 512M",
    "@sap/cds": "3.34.2",
    "@sap/cds-mtx": "git://github.wdf.sap.corp/I830671/cds-mtx.git#fix/suburl",
    "@sap/instance-manager": "git://github.wdf.sap.corp/I830671/node-instance-manager#poc-sm",
    "other": "latest"
  },
  "dependencies": {
    "@sap/xsenv": "latest",
    "@sap/xssec": "^2",
    "@sap/cds": "3.34.2",
    "@sap/cds-mtx": "1.0.16",
    "@sap/instance-manager": "^2.2",
    "@sap/hdi-deploy": "^3",
    "@sap/hana-client": "^2",
    "nodemon": "^2",
    "cfenv": "latest",
    "passport": "^0.4.1",
    "express": "^4.17.1",
    "hdb": "^0.17.2",
    "body-parser": "latest"
  },
  "devDependencies": {},
  "scripts": {
    "postinstall": "npm dedupe && node .build.js",
    "debugstart": "node --inspect server.js",
    "start": "nodemon server.js",
    "watch": "nodemon -w . -i node_modules/**,.git/** -e cds -x npm run build"
  },
  "private": true,
  "cds": {
    "mtx": {
      "app": {
        "urlpart": "-dev-<%= router_name %>.cfapps.us10.hana.ondemand.com"
      },
      "api": {
        "model": true,
        "provisioning": true,
        "metadata": true
      },
      "element-prefix": [
        "Z_",
        "ZZ_"
      ],
      "namespace-blacklist": [
        "com.sap.",
        "sap."
      ],
      "entity-whitelist": [
        "my.bookshop.Books"
      ],
      "service-whitelist": []
    },
    "auth": {
      "passport": {
        "strategy": "JWT"
      }
    },
    "odata": {
      "version": "v4"
    },
    "hana": {
      "deploy-format": "hdbtable"    
    },
    "requires": {
      "db": {
        "kind": "hana",
        "model": [
          "gen"
        ],
        "multiTenant": true,
        "vcap": {
          "label": "service-manager"
        }
      },
      "uaa": {
        "kind": "xsuaa"
      }
    }
  }
}