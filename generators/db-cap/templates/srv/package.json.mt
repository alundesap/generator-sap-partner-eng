{
  "name": "mta_cap-srv",
  "description": "Generated from ../package.json, do not change!",
  "version": "1.0.0",
  "engines": {
    "node": ">=8.0.0 <11.0.0"
  },
  "dependencies": {
    "@sap/xsenv": "latest",
    "@sap/xssec": "^2",
    "@sap/cds": "^3",
    "@sap/cds-mtx": "latest",
    "@sap/hdi-deploy": "^3",
    "@sap/instance-manager": "^2",
    "@sap/hana-client": "^2",
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
    "start": "node server.js",
    "watch": "nodemon -w . -i node_modules/**,.git/** -e cds -x npm run build"
  },
  "private": true,
  "cds": {
    "mtx": {
      "api": {
        "model": true,
        "provisioning": true,
        "metadata": true
      },
      "element-prefix": [
        "Z_"
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
    "requires": {
      "db": {
        "kind": "hana",
        "model": [
          "gen"
        ],
        "multiTenant": true,
        "vcap": {
          "label": "managed-hana"
        }
      },
      "uaa": {
        "kind": "xsuaa"
      }
    }
  }
}
