/* eslint-disable capitalized-comments */
const app = require("express")();
const cds = require("@sap/cds");
const mtx = require("@sap/cds-mtx");
const bodyParser = require('body-parser');

// OLD WAY BEGIN
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

// OLD WAY END

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

// OLD WAY BEGIN
// subscribe/onboard a subscriber tenant
app.put("/mtx/v1/provisioning/tenant/*", function(req, res) {
    let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-') + '-app';
    let tenantURL = 'https:\/\/' + tenantHost + /\.(.*)/gm.exec(appEnv.app.application_uris[0])[0];

    res.status(200).send(tenantURL);
});

// unsubscribe/offboard a subscriber tenant
app.delete("/mtx/v1/provisioning/tenant/*", function(req, res) {
    let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-') + '-app';

  res.status(200).send("");
});

// OLD WAY BEGIN


// NEW WAY BEGIN
//cds.connect.to("db"); // connect to multitenant datasource
//cds.mtx.in(app); // serve cds-mtx APIs
//cds.serve("all").in(app); // serve all CAP business services
// NEW WAY END

const PORT = process.env.PORT || 4004;
app.listen(PORT);
