// Debug by launching like this.
// npx --node-arg=--inspect yo sap-partner-eng
// Then run the "Yo Partner-Eng" run profile
//
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
/* eslint-disable no-useless-concat */
/* eslint-disable block-scoped-var */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
/* eslint-disable capitalized-comments */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");

const exec = require("child_process").execSync;

function cf_is_logged_in() {
  var result = exec('cf api');
  var resStr = result.toString('utf-8');
  if (resStr.search("No API endpoint set.") >= 0) {
    return false;
  } else {
    if (resStr.search("Not logged in.") >= 0) {
      return false;
    } else {
      return true;
    }
  }
}

function get_domains() {

  var retarry = [];

  // retarry.push('domain.com');
 
  var result = exec('cf domains');

  if (result) {
    var output = result.toString("utf8");

      var lines = String(output).split("\n");
      var line = "";
      var first = true;
      for (var i = 1; i <= lines.length; i++) {
        line = lines[i - 1];
        //console.log(`line: ${line}`);
        var words = String(line.replace(/\s+/g, ' ')).split(" ");
        if ((words[1] == 'shared') || (words[1] == 'owned')) {
        if (first) {
          // console.log('domain: ' + words[0]);
          retarry.push(words[0]);
          first = false;
        }
        else {
        if (words[1] == 'owned') {
          //console.log('domain: ' + words[0]);
          retarry.push(words[0]);
          }
        }
      }
    }
  } else {
    retarry.push("Ctrl-C, then cf api ; cf login");
  }
  return retarry;
}


// function makeProjectName(name) {
//   name = _.kebabCase(name);
//   return name;
// }

function suggest_router_name(so_far) {
  //return JSON.stringify(so_far);
  var retstr = "";

  retstr += so_far.app_name + "-app";

  return retstr;
}

function suggest_domain_name(so_far) {
  //return JSON.stringify(so_far);
  var retstr = "";

  var domains = get_domains();

  retstr += domains[0];
  ;

  return retstr;
}


function suggest_uaa_res_name(so_far) {
  //return JSON.stringify(so_far);
  var retstr = "";

  retstr += so_far.app_name + "-uaa";

  return retstr;
}

function suggest_uaa_svc_name(so_far) {
  //return JSON.stringify(so_far);
  var retstr = "";

  retstr += so_far.app_name.toUpperCase() + "_UAA";

  return retstr;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.answers = {};
    this.config.defaults({
      project_name: this.appname,
      app_name: "app",
      app_desc: "App Description",
      router_name: "app",
      router_path: "app",
      database_path: "db",
      services_path: "srv",
      uaa_res_name: "app-uaa",
      uaa_svc_name: "APP_UAA"
    });

  }

  async prompting() {
    var prompts = [];

    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the ${chalk.red("SAP\nPartner Engineering")} project generator!`)
    );

    this.log(
      `After you've generated your base MTA project you can enhance it with the following subgenerators.`
      +`\n npx --node-arg=--inspect yo sap-partner-eng:subgen`
    );
    this.log(``);
    this.log(`Add Jenkins support with           "?yo sap-partner-eng:jenkins"`);
    this.log(`Add Deploy to XSA extension with   "?yo sap-partner-eng:deploy2xsa"`);
    this.log(`Add a Manually managed schema with "?yo sap-partner-eng:db-sch"`);
    this.log(`Add a HDB-style HDI container with "?yo sap-partner-eng:db-hdb"`);
    this.log(`Add a CAP-style HDI container with "yo sap-partner-eng:db-cap"`);
    this.log(`Add a HANA SecureStore with        "?yo sap-partner-eng:db-ss"`);
    this.log(`Add a NodeJS based module with     "yo sap-partner-eng:module-nodejs"`);
    this.log(`Add a Java based module with       "?yo sap-partner-eng:module-java"`);
    this.log(`Add a Python based module with     "?yo sap-partner-eng:module-python"`);
    this.log(`Add a Docker based module with     "?yo sap-partner-eng:module-docker"`);
    this.log(``);
    this.log(
      `* = This module is not yet available or is in developoment.  YMMV.`
    );
    this.log(``);

    // const prompts = [
    //   {
    //     type: "confirm",
    //     name: "someAnswer",
    //     message: "Would you like to enable this option?",
    //     default: true
    //   }
    // ];

    /*
    Return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
	  */

    prompts.push({
      type: "input",
      name: "project_name",
      message:
        "Enter your project folder name (will be created if necessary).",
      default: this.config.get("project_name") // Default to current folder name
    });

    prompts.push({
      type: "input",
      name: "app_name",
      // prefix: "The value here will be used as a suggetion.\n",
      message: "Enter your project application name (will be used for defaults).",
      default: this.config.get("app_name") // Default to current folder name
    });
      
    prompts.push({
      type: "input",
      name: "app_desc",
      message: "Enter your project application description.",
      default: this.config.get("app_desc") // Default to current folder name
    });
      
    prompts.push({
      type: "input",
      name: "router_name",
      message: "Application router internal module name.",
      default: suggest_router_name
    });
    
    if (cf_is_logged_in()) {
      prompts.push({
        type: "list",
        name: "domain_name",
        prefix: "This list of domain names is based on the current 'cf domains' command.\n",
        message: "Domain name.",
        // choices: ["cfapps.us10.hana.ondemand.com","conciletime.com"],
        choices: get_domains(),
        default: suggest_domain_name
      });
    }
      
    if (!cf_is_logged_in()) {
      prompts.push({
          type: "input",
          name: "domain_name",
          prefix: "Enter domain name or abort and login with 'cf login' command.\n",
          message: "Domain name.",
          default: "cfapps.us10.hana.ondemand.com",
      });
    }
      
    prompts.push({
      type: "input",
      name: "router_path",
      message: "Application router path",
      default: this.config.get("router_path")
    });
      
    prompts.push({
      type: "input",
      name: "database_path",
      message: "Domain/Database model path",
      default: this.config.get("database_path")
    });
      
    prompts.push({
      type: "input",
      name: "services_path",
      message: "Services definition path",
      default: this.config.get("services_path")
    });
      
    prompts.push({
      type: "input",
      name: "uaa_res_name",
      message: "UAA resource name",
      default: suggest_uaa_res_name
    });
      
    prompts.push({
      type: "input",
      name: "uaa_svc_name",
      message: "UAA service name",
      default: suggest_uaa_svc_name
    });
      
    this.answers = await this.prompt(prompts);

  }

  default() {
    if (path.basename(this.destinationPath()) !== this.answers.project_name) {
      this.log(
        `Your project must be inside a folder named ${this.answers.project_name}\nI'll automatically create this folder.  Change into it with "cd ${this.answers.project_name}"`
      );
      mkdirp(this.answers.project_name);
      this.destinationRoot(this.destinationPath(this.answers.project_name));
    }
  }

  writing() {
    var pkginfo = require('pkginfo')(module);

    this.config.set("package_version", module.exports.version);

    this.config.set("project_name", this.answers.project_name);
    this.config.set("app_name", this.answers.app_name);
    this.config.set("app_desc", this.answers.app_desc);

    this.config.set("router_name", this.answers.router_name);
    this.config.set("domain_name", this.answers.domain_name);
    this.config.set("router_path", this.answers.router_path);
    this.config.set("database_path", this.answers.database_path);
    this.config.set("services_path", this.answers.services_path);

    this.config.set("uaa_res_name", this.answers.uaa_res_name);
    this.config.set("uaa_svc_name", this.answers.uaa_svc_name);

    this.config.save();

    // this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));


    var subs = {
      package_version: module.exports.version,
      project_name: this.answers.project_name,
      app_name: this.answers.app_name,
      app_desc: this.answers.app_desc,
      router_name: this.answers.router_name,
      domain_name: this.answers.domain_name,
      router_path: this.answers.router_path,
      database_path: this.answers.database_path,
      services_path: this.answers.services_path,
      uaa_res_name: this.answers.uaa_res_name,
      uaa_svc_name: this.answers.uaa_svc_name
    };

    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      subs
    );

    //this.fs.copy(
    //  this.templatePath("gitignore"),
    //  this.destinationPath(".gitignore")
    //);

    this.fs.copy(
      this.templatePath(".cdsrc.json"),
      this.destinationPath(".cdsrc.json")
    );

    this.fs.copy(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore")
    );

    this.fs.copy(
      this.templatePath(".eslintrc"),
      this.destinationPath(".eslintrc")
    );

    this.fs.copy(
      this.templatePath(".vscode/*"),
      this.destinationPath(".vscode")
    );

    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      subs
    );

    this.fs.copy(
      this.templatePath("app/package.json"),
      this.destinationPath(this.answers.router_path + "/package.json")
    );
    this.fs.copy(
      this.templatePath("app/xs-app.json"),
      this.destinationPath(this.answers.router_path + "/xs-app.json")
    );
    this.fs.copyTpl(
      this.templatePath("app/resources/index.html"),
      this.destinationPath(this.answers.router_path + "/resources/index.html"),
      subs
    );

    this.fs.copy(
      this.templatePath("db/README.md"),
      this.destinationPath(this.answers.database_path + "/README.md")
    );

    this.fs.copy(
      this.templatePath("srv/README.md"),
      this.destinationPath(this.answers.services_path + "/README.md")
    );

    this.fs.copy(
      this.templatePath("app/resources/favicon.ico"),
      this.destinationPath(this.answers.router_path + "/resources/favicon.ico")
    );

    // Now xs-security is embodied in the mta.yaml file freeing this up for cds-security.json
    // this.fs.copyTpl(
    //   this.templatePath("xs-security.json"),
    //   this.destinationPath("xs-security.json"),
    //   subs
    // );

  }

  install() {
    // This.installDependencies();
  }

  end() {
    this.log(``);
    this.log(`Add Jenkins support with           "?yo sap-partner-eng:jenkins"`);
    this.log(`Add Deploy to XSA extension with   "?yo sap-partner-eng:deploy2xsa"`);
    this.log(`Add a Manually managed schema with "?yo sap-partner-eng:db-sch"`);
    this.log(`Add a HDB-style HDI container with "?yo sap-partner-eng:db-hdb"`);
    this.log(`Add a CAP-style HDI container with "yo sap-partner-eng:db-cap"`);
    this.log(`Add a HANA SecureStore with        "?yo sap-partner-eng:db-ss"`);
    this.log(`Add a NodeJS based module with     "yo sap-partner-eng:module-nodejs"`);
    this.log(`Add a Java based module with       "?yo sap-partner-eng:module-java"`);
    this.log(`Add a Python based module with     "?yo sap-partner-eng:module-python"`);
    this.log(`Add a Docker based module with     "?yo sap-partner-eng:module-docker"`);
    this.log(``);
    this.log(
      `* = This module is not yet available or is in developoment.  YMMV.`
    );
    this.log(``);

    this.log(`\nYour project is ready.  Change into it with "cd ${this.answers.project_name}"`);
    this.log(`Build+Deploy : "cd ${this.answers.project_name} ; mkdir -p mta_archives ; mbt build -p=cf -t=mta_archives --mtar=${this.answers.project_name}.mtar ; cf deploy mta_archives/${this.answers.project_name}.mtar -f"`);
    this.log(`UnDeploy : "cf undeploy ${this.answers.app_name} -f --delete-services"`);
    this.log(`Change into it with "cd ${this.answers.project_name}"`);
    if (cf_is_logged_in()) {
      this.log(JSON.stringify(get_domains()));
    }
  }
};
