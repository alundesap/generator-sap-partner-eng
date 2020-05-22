/* eslint-disable capitalized-comments */
const app = require("express")();
const cds = require("@sap/cds");

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

/*
// subscribe/onboard a subscriber tenant
app.put("/mtx/v1/provisioning/tenant/*", function(req, res) {
  var tenantAppURL =
    "https://" + req.body.subscribedSubdomain + ".conciletime.com";
  // Normal handling
  // res.status(200).send(tenantAppURL);

  // Force it to log and fail
  console.log("Registration Request for: " + req.url + " is aborted.");
  res.status(500).send("");
});

// unsubscribe/offboard a subscriber tenant
app.delete("/mtx/v1/provisioning/tenant/*", function(req, res) {
  res.status(200).send("");
});
*/

cds.connect.to("db"); // connect to multitenant datasource
cds.mtx.in(app); // serve cds-mtx APIs
cds.serve("all").in(app); // serve all CAP business services

const PORT = process.env.PORT || 4004;
app.listen(PORT);
