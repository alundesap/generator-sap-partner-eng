// If you use CommonJS modules
const YAWN = require('yawn-yaml/cjs')
fs   = require('fs');
 
let str = `
# my comment
value: 1 # the value is here!
`;
 
var yawn = new YAWN(fs.readFileSync('test.yaml', 'utf8'));
 
//yawn.json = {version: "0.0.2"};

//var mta = JSON.parse(yawn.json);


console.log("version:" + yawn.json.version);

var mta = yawn.json;

// Change a top level existing value
mta.version = '9.9.9';

console.log("version:" + mta.version);
 
console.log(JSON.stringify(mta));

// Change a second level existing value
mta.parameters['enable-parallel-deployments'] = false;

console.log("enable:" + mta.parameters['enable-parallel-deployments']);
 
console.log(JSON.stringify(mta.parameters));

// Append a new top level value
mta.putMeLast = "At the End";

 
console.log(JSON.stringify(mta));

// Change Existing module value

mta.modules[0]['name'] = "mytime-app";

// Append a new module

mta.modules.push( { 
	"name": "new-module", 
	"type": "python", 
	"path": "newbie",
	"parameters": { 
		"domain": "trustedfilter.net",
		"routes": [ { "route": "this_way" }, { "route": 'that_way.${default-domain}' } ],
		"etc": "whatever"
	}
} );

yawn.json = mta;

// value in `yawn.yaml` is now changed.
console.log(yawn.yaml);

