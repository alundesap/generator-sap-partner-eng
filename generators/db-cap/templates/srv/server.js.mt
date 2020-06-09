/* eslint-disable capitalized-comments */
const app = require("express")();
const cds = require("@sap/cds");
//const mtx = require("@sap/cds-mtx");

var cds_mtx_way = true;

// OLD WAY BEGIN
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  console.log("==== method: " + req.method + " + " + req.url);
  console.log("==== headers:" + JSON.stringify(req.headers) + "====");
  console.log("==== body:" + JSON.stringify(req.body) + "====");
  next();
}

if (!cds_mtx_way) {
  const bodyParser = require('body-parser');
  const cfenv = require('cfenv');
  const appEnv = cfenv.getAppEnv();

  const xsenv = require('@sap/xsenv');
  xsenv.loadEnv();
  const services = xsenv.getServices({
      uaa: { tag: 'xsuaa' },
      registry: { tag: 'SaaS' }
  });

  const xssec = require('@sap/xssec');
  const passport = require('passport');
  passport.use('JWT', new xssec.JWTStrategy(services.uaa));
  app.use(passport.initialize());
  app.use(passport.authenticate('JWT', {
      session: false
  }));

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    console.log("req: " + req.method + " : " + req.url);
    next(); // this will invoke next middleware function
  });

  // subscribe/onboard a subscriber tenant
  app.get("/mtx/v1/provisioning/tenant/*", function(req, res) {
    var responseStr = "";
    responseStr +=
      "<!DOCTYPE HTML><html><head><title>CAP-MTX</title></head><body><h1>CAP-MTX</h1><h2>WARNING!</h2><br />";
    responseStr +=
      "Tenant callback endpoint only allows PUT and DELETE methods to facilitate subscribe/unsubscribe.<br />";
    responseStr += "</body></html>";
    console.log("Tenant callback endpoint only allows PUT and DELETE methods to facilitate subscribe/unsubscribe");
    res.status(200).send(responseStr);
  });

  app.get("/admin", function(req, res) {
    res.status(200).send("");
  });

  // subscribe/onboard a subscriber tenant
  app.put("/mtx/v1/provisioning/tenant/*", function(req, res) {
      let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-') + '-app';
      let tenantURL = 'https:\/\/' + tenantHost + /\.(.*)/gm.exec(appEnv.app.application_uris[0])[0];

      console.log("==== Tenant URL: " + tenantURL + "====");
      console.log("==== headers:" + JSON.stringify(req.headers) + "====");
      console.log("==== body:" + JSON.stringify(req.body) + "====");

      res.status(200).send(tenantURL);
  });

  // unsubscribe/offboard a subscriber tenant
  app.delete("/mtx/v1/provisioning/tenant/*", function(req, res) {
      let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-') + '-app';

    res.status(200).send("");
  });
  // OLD WAY END

} else {

  // NEW WAY BEGIN
  app.use(myLogger);
  // connect to datasource 'db' which must be the HANA instance manager 
  cds.connect.to('db'); 
  // serve cds-mtx APIs
  cds.mtx.in(app); 
  // serve application defined services: in combination with a CAP Java server, this won't appear here.
  cds.serve('all').in(app);

  // NEW WAY END

}

const PORT = process.env.PORT || 4444;
console.log("Listening on: " + PORT);
app.listen(PORT);
