const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');

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

async function connectAPI() {
    try {
        let options1 = {
            method: 'GET',
            url: appEnv.app.cf_api + '/info'
        };
        let res1 = await axios(options1);
        try {
            let options2 = {
                method: 'POST',
                url: res1.data.authorization_endpoint + '/oauth/token?grant_type=password',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': 'Basic Y2Y6'
                },
                data: qs.stringify({
                    username: process.env.CF_API_USER,
                    password: process.env.CF_API_PW
                })
            };
            let res2 = await axios(options2);
            try {
                let options3 = {
                    method: 'GET',
                    url: appEnv.app.cf_api + '/v3/apps?organization_guids=' + appEnv.app.organization_id + '&space_guids=' + appEnv.app.space_id + '&names=' + services.registry.appName,
                    headers: {
                        'Authorization': 'Bearer ' + res2.data.access_token
                    }
                };
                let res3 = await axios(options3);
                try {
                    let options4 = {
                        method: 'GET',
                        url: appEnv.app.cf_api + '/v3/domains?names=' + /\.(.*)/gm.exec(appEnv.app.application_uris[0])[1],
                        headers: {
                            'Authorization': 'Bearer ' + res2.data.access_token
                        }
                    };
                    let res4 = await axios(options4);
                    return {
                        'access_token': res2.data.access_token,
                        'application_id': res3.data.resources[0].guid,
                        'domain_id': res4.data.resources[0].guid
                    };
                } catch (err) {
                    console.log(err.stack);
                    return err.message;
                }
            } catch (err) {
                console.log(err.stack);
                return err.message;
            }
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};

async function createRoute(tenantHost, connectRes) {
    try {
        let options1 = {
            method: 'POST',
            url: appEnv.app.cf_api + '/v3/routes/',
            headers: {
                'Authorization': 'Bearer ' + connectRes.access_token,
                'Content-Type': 'application/json'
            },
            data: {
                'host': tenantHost,
                'relationships': {
                    'space': {
                        'data': {
                            'guid': appEnv.app.space_id
                        }
                    },
                    'domain': {
                        'data': {
                            'guid': connectRes.domain_id
                        }
                    }
                }
            }
        }
        let res1 = await axios(options1);
        try {
            let options2 = {
                method: 'POST',
                url: appEnv.app.cf_api + '/v3/routes/' + res1.data.guid + '/destinations',
                headers: {
                    'Authorization': 'Bearer ' + connectRes.access_token,
                    'Content-Type': 'application/json'
                },
                data: {
                    'destinations': [{
                        'app': {
                            'guid': connectRes.application_id
                        }
                    }]
                }
            };
            let res2 = await axios(options2);
            return res2.data;
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    };
};

async function deleteRoute(tenantHost, connectRes) {
    try {
        let options1 = {
            method: 'GET',
            url: appEnv.app.cf_api + '/v3/apps/' + connectRes.application_id + '/routes?hosts=' + tenantHost,
            headers: {
                'Authorization': 'Bearer ' + connectRes.access_token
            }
        }
        let res1 = await axios(options1);
        try {
            let options2 = {
                method: 'DELETE',
                url: appEnv.app.cf_api + '/v3/routes/' + res1.data.resources[0].guid,
                headers: {
                    'Authorization': 'Bearer ' + connectRes.access_token
                }
            };
            let res2 = await axios(options2);
            return res2.data;
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    };
};

// subscribe/onboard a subscriber tenant
app.put('/mtx/v1/provisioning/tenant/*', function (req, res) {
    // assume app router name is same as saas-registry app name & ensure in lowercase & all _ converted to -
    // let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-');
    let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-') + '-app';
    let tenantURL = 'https:\/\/' + tenantHost + /\.(.*)/gm.exec(appEnv.app.application_uris[0])[0];

    //res.status(200).send(tenantURL);
	
    connectAPI().then(
        function (res1) {
            createRoute(tenantHost, res1).then(
                function (res2) {
                    console.log('Subscribe: ', tenantHost, res2);
                    res.status(200).send(tenantURL);
                },
                function (err) {
                    console.log(err.stack);
                    res.status(500).send(err.message);
                });
        },
        function (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        });
});

// unsubscribe/offboard a subscriber tenant
app.delete('/mtx/v1/provisioning/tenant/*', function (req, res) {
    // assume app router name is same as saas-registry app name & ensure in lowercase & all _ converted to -
    let tenantHost = req.body.subscribedSubdomain + '-' + appEnv.app.space_name.toLowerCase().replace(/_/g,'-') + '-' + services.registry.appName.toLowerCase().replace(/_/g,'-') + '-app';

    //res.status(200).send('');
	//
    connectAPI().then(
        function (res1) {
            deleteRoute(tenantHost, res1).then(
                function (res2) {
                    console.log('Unsubscribe: ', tenantHost, res2);
                    res.status(200).send('');
                },
                function (err) {
                    console.log(err.stack);
                    res.status(500).send(err.message);
                });
        },
        function (err) {
            console.log(err.stack);
            res.status(500).send(err.message);
        });
});

// app user functionality
app.get('/srv/info', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.User')) {
        let info = {
            'userInfo': req.authInfo.userInfo,
            'subdomain': req.authInfo.subdomain,
            'consumerTenantId': req.authInfo.identityZone
        };
        res.status(200).json(info);
    } else {
        res.status(403).send('Forbidden');
    }
});

// app default link
app.get('/<%= module_route %>/', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.User')) {
    	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title><%= app_name %></title></head><body><h1><%= app_name %> Utils</h1><h2>SUCCESS!</h2><br />";
	responseStr += "<a href=\"/srv/info\">User Info.</a><br />";
	responseStr += "<a href=\"/srv/admin\">Admin Info.</a><br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
    } else {
        res.status(403).send('Forbidden');
    }
});

app.get("/<%= module_route %>/links", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title><%= app_name %></title></head><body><h1><%= module_name %></h1><h2>SUCCESS!</h2><br />";
	responseStr += "<a href=\"/<%= module_route %>/links\">Links page.</a><br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

async function getSubscriptions() {
    try {
        let options1 = {
            method: 'POST',
            url: services.registry.url + '/oauth/token?grant_type=client_credentials&response_type=token',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(services.registry.clientid + ':' + services.registry.clientsecret).toString('base64')
            }
        };
        let res1 = await axios(options1);
        try {
            let options2 = {
                method: 'GET',
                url: services.registry.saas_registry_url + '/saas-manager/v1/application/subscriptions',
                headers: {
                    'Authorization': 'Bearer ' + res1.data.access_token
                }
            };
            let res2 = await axios(options2);
            return res2.data;
        } catch (err) {
            console.log(err.stack);
            return err.message;
        }
    } catch (err) {
        console.log(err.stack);
        return err.message;
    }
};

// app admin functionality
app.get('/srv/admin', function (req, res) {
    if (req.authInfo.checkScope('$XSAPPNAME.Administrator')) {
        getSubscriptions().then(
            function (result) {
                res.status(200).json(result);
            },
            function (err) {
                console.log(err.stack);
                res.status(500).send(err.message);
            });
    } else {
        res.status(403).send('Forbidden');
    }
});

const port = appEnv.port || 5001;
app.listen(port, function () {
    console.info('Listening on http://localhost:' + port);
});
