{
  "name": "mta_cap-srv",
  "description": "Generated from ../package.json, do not change!",
  "version": "1.0.0",
  "dependencies": {
    "@sap/xsenv": "latest",
    "@sap/xssec": "latest",
    "@sap/cds": "^3",
    "@sap/cds-mtx": "git://github.com/andrewlunde/cds-mtx.git",
    "@sap/hdi-deploy": "^3",
    "@sap/instance-manager": "^2",
    "cfenv": "latest",
    "passport": "^0.4.1",
    "express": "^4.17.1",
    "hdb": "^0.17.2",
    "body-parser": "latest"
  },
  "devDependencies": {},
  "scripts": {
    "postinstall": "npm dedupe && node .build.js",
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
}
