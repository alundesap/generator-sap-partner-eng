{
    "name": "<%= app_name %>-srv",
    "description": "Generated from ../package.json, do not change!",
    "version": "1.0.0",
    "dependencies": {
        "@sap/cds": "^3.34.2",
        "express": "^4.17.1"
    },
    "engines": {
        "node": "^10 || ^12"
    },
    "devDependencies": {},
    "scripts": {
        "postinstall": "npm dedupe && node .build.js",
        "start": "node ./node_modules/@sap/cds/bin/cds.js serve gen/csn.json",
        "watch": "nodemon -w . -i node_modules/**,.git/** -e cds -x npm run build"
    },
    "private": true,
    "cds": {
        "requires": {
            "db": {
                "kind": "hana",
                "model": "gen/csn.json"
            }
        }
    }
}
