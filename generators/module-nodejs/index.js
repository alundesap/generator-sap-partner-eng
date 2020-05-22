// Debug by launching like this.
// npx --node-arg=--inspect yo sap-partner-eng:module-nodejs
// Then run the "Yo Partner-Eng" run profile
//
/* eslint-disable no-redeclare */
/* eslint-disable no-useless-concat */
/* eslint-disable block-scoped-var */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable spaced-comment */
/* eslint-disable camelcase */
/* eslint-disable capitalized-comments */
"use strict";
const Generator = require("yeoman-generator");
// const chalk = require("chalk");
// const yosay = require("yosay");
const YAWN = require("yawn-yaml/cjs");
const DepGraph = require("dependency-graph").DepGraph;

global.globConfig = [];

module.exports = class extends Generator {

  initializing() {
    this.props = {};
    this.answers = {};

    var the_app_name = "";
    if (typeof this.config.get("app_name") !== "undefined") {
      the_app_name = this.config.get("app_name");
    }

    var names = this.config.get("module_names");
    var suggested_name = the_app_name + "-njs";
    if (typeof names === "undefined") {
      this.config.set("module_names", []);
    } else {
      var found = false;
      do {
        found = false;
        names.forEach(name => {
          if (suggested_name === name) {
            found = true;
          }
        });
        if (found) suggested_name += "-x";
        else break;
      } while (found);
    }

    var paths = this.config.get("module_paths");
    var suggested_path = "njs-" + the_app_name;
    if (typeof paths === "undefined") {
      this.config.set("module_paths", []);
    } else {
      var found = false;
      do {
        found = false;
        paths.forEach(path => {
          if (suggested_path === path) {
            found = true;
          }
        });
        if (found) suggested_path += "-x";
        else break;
      } while (found);
    }

    var apis = this.config.get("module_apis");
    var suggested_api = the_app_name + "_njs_api";
    if (typeof apis === "undefined") {
      this.config.set("module_apis", []);
    } else {
      var found = false;
      do {
        found = false;
        apis.forEach(api => {
          if (suggested_api === api) {
            found = true;
          }
        });
        if (found) suggested_api += "_x";
        else break;
      } while (found);
    }

    var bes = this.config.get("module_bes");
    var suggested_be = the_app_name + "_njs_be";
    if (typeof bes === "undefined") {
      this.config.set("module_bes", []);
    } else {
      var found = false;
      do {
        found = false;
        bes.forEach(be => {
          if (suggested_be === be) {
            found = true;
          }
        });
        if (found) suggested_be += "_x";
        else break;
      } while (found);
    }

    var routes = this.config.get("module_routes");
    var suggested_route = the_app_name + "_njs_route";
    if (typeof routes === "undefined") {
      this.config.set("module_routes", []);
    } else {
      var found = false;
      do {
        found = false;
        routes.forEach(route => {
          if (suggested_route === route) {
            found = true;
          }
        });
        if (found) suggested_route += "_x";
        else break;
      } while (found);
    }

    this.config.defaults({
      module_name: suggested_name,
      module_path: suggested_path,
      module_api: suggested_api,
      module_be: suggested_be,
      module_route: suggested_route,
      multitenant_enabled: false,
      router_dir: "web"
    });
   
    globConfig = this.config;
  }

  async prompting() {
    // Have Yeoman greet the user.
    //this.log(
    //  yosay(`Welcome to the fabulous ${chalk.red('generator-sap-a-team-haa')} generator!`)
    //);

    //this.log("Options:" + JSON.stringify(this.options.app_name));
    //this.log("Config:" + this.config.get("app_name"));
    //this.log("Config Typeof:" + typeof(this.config.get("app_name")));

    // Docs about prompting options are here: 
    // https://github.com/SBoudrias/Inquirer.js#objects
    var prompts = [];

    if (typeof this.config.get("app_name") === "undefined") {
      prompts.push({
        type: "input",
        name: "app_name",
        message: "Enter your project application name.",
        default: this.config.get("app_name") // Default to current folder name
      });
    } else {
      this.answers.app_name = this.config.get("app_name");
      this.log("Using app_name: " + this.answers.app_name);
    }

    if (typeof this.config.get("router_dir") === "undefined") {
      prompts.push({
        type: "input",
        name: "router_dir",
        message: "Application router path",
        default: this.config.get("router_dir")
      });
    } else {
      this.answers.router_dir = this.config.get("router_dir");
      this.log("Using router_dir: " + this.answers.router_dir);
    }

    prompts.push({
      type: "input",
      name: "module_name",
      message: "NodeJS Module Name.",
      default: this.config.get("module_name"),
      validate: function (input) {
        // Declare function as asynchronous, and save the done callback
        var done = this.async();
    
        // Do async stuff
        setTimeout(function() {
          
          var names = globConfig.get("module_names");
          var typeModName = typeof names;

          if (typeModName === "undefined") {
            done(null, true);
          }
          else if (input === globConfig.get("app_name")) {
            done('Already used as application name');
            return;
          }
          else if (input === globConfig.get("router_name")) {
            done('Already used as approuter name');
            return;
          }
          else if (input === globConfig.get("router_dir")) {
            done('Already used as approuter path');
            return;
          }
          else if (typeModName === "object") {
            for( var i = 0; i < names.length; i++) {
              var existing_name = names[i];
              if (input == existing_name) {
                done('Already used');
                return;
              }
            }
          }
         // Pass the return value in the done callback
          done(null, true);
        }, 500);
      }
    });

    prompts.push({
      type: "input",
      name: "module_path",
      message: "NodeJS Module Path.",
      default: this.config.get("module_path"),
      validate: function (input) {
        // Declare function as asynchronous, and save the done callback
        var done = this.async();
    
        // Do async stuff
        setTimeout(function() {
          
          var paths = globConfig.get("module_paths");
          var typeModPath = typeof paths;

          if (typeModPath === "undefined") {
            done(null, true);
          }
          else if (input === globConfig.get("router_dir")) {
            done('Already used as approuter path');
            return;
          } 
          else if (input === globConfig.get("database_dir")) {
            done('Already used as database path');
            return;
          } 
          else if (input === globConfig.get("services_dir")) {
            done('Already used as services path');
            return;
          } 
          else if (typeModPath === "object") {
            for( var i = 0; i < paths.length; i++) {
              var existing_path = paths[i];
              if (input == existing_path) {
                done('Already used');
                return;
              }
            }
          }
         // Pass the return value in the done callback
          done(null, true);
        }, 500);
      }
    });

    prompts.push({
      type: "input",
      name: "module_api",
      message: "NodeJS Module API (Internal Reference).",
      default: this.config.get("module_api"),
      validate: function (input) {
        // Declare function as asynchronous, and save the done callback
        var done = this.async();
    
        // Do async stuff
        setTimeout(function() {
          
          var apis = globConfig.get("module_apis");
          var typeModPath = typeof apis;

          if (typeModPath === "undefined") {
            done(null, true);
          }
          else if (input === globConfig.get("router_dir")) {
            done('Already used as approuter path');
            return;
          } 
          else if (input === globConfig.get("database_dir")) {
            done('Already used as database path');
            return;
          } 
          else if (input === globConfig.get("services_dir")) {
            done('Already used as services path');
            return;
          } 
          else if (typeModPath === "object") {
            for( var i = 0; i < apis.length; i++) {
              var existing_api = apis[i];
              if (input == existing_api) {
                done('Already used');
                return;
              }
            }
          }
         // Pass the return value in the done callback
          done(null, true);
        }, 500);
      }

    });

    prompts.push({
      type: "input",
      name: "module_be",
      message: "NodeJS Module Back End (AppRouter Destination).",
      default: this.config.get("module_be"),      validate: function (input) {
        // Declare function as asynchronous, and save the done callback
        var done = this.async();
    
        // Do async stuff
        setTimeout(function() {
          
          var bes = globConfig.get("module_bes");
          var typeModPath = typeof bes;

          if (typeModPath === "undefined") {
            done(null, true);
          }
          else if (input === globConfig.get("router_dir")) {
            done('Already used as approuter path');
            return;
          } 
          else if (input === globConfig.get("database_dir")) {
            done('Already used as database path');
            return;
          } 
          else if (input === globConfig.get("services_dir")) {
            done('Already used as services path');
            return;
          } 
          else if (typeModPath === "object") {
            for( var i = 0; i < bes.length; i++) {
              var existing_be = bes[i];
              if (input == existing_be) {
                done('Already used');
                return;
              }
            }
          }
         // Pass the return value in the done callback
          done(null, true);
        }, 500);
      }

    });

    prompts.push({
      type: "input",
      name: "module_route",
      message: "Route path(after first /) that your module will handle",
      default: this.config.get("module_route"),
      validate: function (input) {
        // Declare function as asynchronous, and save the done callback
        var done = this.async();
    
        // Do async stuff
        setTimeout(function() {
          
          var routes = globConfig.get("module_routes");
          var typeModPath = typeof routes;

          if (typeModPath === "undefined") {
            done(null, true);
          }
          else if (input === globConfig.get("router_dir")) {
            done('Already used as approuter path');
            return;
          } 
          else if (input === globConfig.get("database_dir")) {
            done('Already used as database path');
            return;
          } 
          else if (input === globConfig.get("services_dir")) {
            done('Already used as services path');
            return;
          } 
          else if (typeModPath === "object") {
            for( var i = 0; i < routes.length; i++) {
              var existing_route = routes[i];
              if (input == existing_route) {
                done('Already used');
                return;
              }
            }
          }
         // Pass the return value in the done callback
          done(null, true);
        }, 500);
      }

    });

    prompts.push({
      type: "confirm",
      name: "multitenant_enabled",
      message: "Use this NodeJS module to handle multitenant subscription requests?",
      when: function () {
        var retval = false;
        var enabled = globConfig.get("multitenant_enabled");
        if (enabled) {
          retval = false;
        }
        else {
          retval = true;
        }
        return retval;
      }
    });

    this.answers = await this.prompt(prompts);

    if (typeof this.config.get("app_name") !== "undefined") {
      this.answers.app_name = this.config.get("app_name");
    }

    if (typeof this.config.get("router_dir") !== "undefined") {
      this.answers.router_dir = this.config.get("router_dir");
    }

    if (typeof this.config.get("domain_name") !== "undefined") {
      this.answers.domain_name = this.config.get("domain_name");
      this.log("Using domain_name: " + this.answers.domain_name);
    }

    if (typeof this.config.get("uaa_res_name") !== "undefined") {
      this.answers.uaa_res_name = this.config.get("uaa_res_name");
      this.log("Using uaa_res_name: " + this.answers.uaa_res_name);
    }

    if (typeof this.config.get("hdi_res_name") !== "undefined") {
      this.answers.hdi_res_name = this.config.get("hdi_res_name");
      this.log("Using hdi_res_name: " + this.answers.hdi_res_name);
    }
  }

  writing() {

    this.config.delete("module_name");
    var names = this.config.get("module_names");
    names.push(this.answers.module_name);
    this.config.set("module_names", names);

    this.config.delete("module_path");
    var paths = this.config.get("module_paths");
    paths.push(this.answers.module_path);
    this.config.set("module_paths", paths);

    this.config.delete("module_api");
    var apis = this.config.get("module_apis");
    apis.push(this.answers.module_api);
    this.config.set("module_apis", apis);

    this.config.delete("module_be");
    var bes = this.config.get("module_bes");
    bes.push(this.answers.module_be);
    this.config.set("module_bes", bes);

    this.config.delete("module_route");
    var routes = this.config.get("module_routes");
    routes.push(this.answers.module_route);
    this.config.set("module_routes", routes);

    //this.config.set("module_name", this.config.module_name);
    //this.config.delete("module_name");
    //this.config.set("module_names", names);
    //this.config.set("module_path", this.answers.module_path);
    //this.config.delete("module_path");
    //this.config.set("module_paths", paths);
    //this.config.set("module_api", this.answers.module_api);
    //this.config.set("module_be", this.answers.module_be);
    //this.config.set("module_route", this.answers.module_route);
    //this.config.set("router_dir", this.answers.router_dir);

    if (typeof this.answers.multitenant_enabled !== "undefined") {
      this.config.set("multitenant_enabled", this.answers.multitenant_enabled);

      if (this.answers.multitenant_enabled) {
        this.config.set("multitenant_module", this.answers.module_name);
      }
    }

    this.config.save();

    var subs = {
      app_name: this.answers.app_name,
      module_name: this.answers.module_name,
      module_path: this.answers.module_path,
      module_api: this.answers.module_api,
      module_be: this.answers.module_be,
      module_route: this.answers.module_route,
      domain_name: this.answers.domain_name,
      uaa_res_name: this.answers.uaa_res_name,
      hdi_res_name: ""
    };

    if (typeof this.answers.hdi_res_name !== "undefined") {
      this.log("Requiring to hdi_res_name: " + this.answers.hdi_res_name);
      subs.hdi_res_name = "\n" + "    - name: " + this.answers.hdi_res_name;
    }

    //this.log(":" + subs.hdi_res_name + ":");

    this.fs.copy(
      this.templatePath("nodejs/.eslintrc"),
      this.destinationPath(this.answers.module_path + "/.eslintrc")
    );
    this.fs.copy(
      this.templatePath("nodejs/.eslintrc.ext"),
      this.destinationPath(this.answers.module_path + "/.eslintrc.ext")
    );
    // this.fs.copy(
    //  this.templatePath("nodejs/gitignore"),
    //  this.destinationPath(this.answers.module_path + "/.gitignore")
    //);
    this.fs.copy(
      this.templatePath("nodejs/package.json"),
      this.destinationPath(this.answers.module_path + "/package.json")
    );
    this.fs.copyTpl(
      this.templatePath("nodejs/server.js"),
      this.destinationPath(this.answers.module_path + "/server.js"),
      subs
    );

    this.fs.copy(
      this.destinationPath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      {
        
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";

          var lines = String(content).split("\n");
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("### New Modules Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              ins = "";
              ins += "\n\n";
              ins += indent + "# cf push <?= module_name ?> -p <?= module_path ?> -n <?= module_name ?> -d <?= domain_name ?> -k 512M -m 256M" + "\n";
              ins += indent + " - name: <?= module_name ?>" + "\n";
              ins += indent + "   type: nodejs" + "\n";
              ins += indent + "   path: <?= module_path ?>" + "\n";
              ins += indent + "   build-parameters:" + "\n";
              ins += indent + "      ignore: [\"node_modules/\"]" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 256M" + "\n";
              ins += indent + "      disk-quota: 512M" + "\n";
              ins += indent + "      #host: <?= module_name ?>-${space}" + "\n";
              ins += indent + "      #domain: <?= domain_name ?>" + "\n";
              ins += indent + "   provides:" + "\n";
              ins += indent + "    - name: <?= module_api ?>" + "\n";
              ins += indent + "      properties:" + "\n";
              ins += indent + "         url: ${default-url}" + "\n";
              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= uaa_res_name ?>";
              ins += indent + "<?= hdi_res_name ?>";

              line += ins;
            }

            pos = line.search("### New Destinations Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              ins = "";
              ins += "\n";

              ins += indent + " - name: <?= module_api ?>" + "\n";
              ins += indent + "   group: destinations" + "\n";
              ins += indent + "   properties:" + "\n";
              ins += indent + "      name: <?= module_be ?>" + "\n";
              ins += indent + "      url: ~{url}" + "\n";
              ins += indent + "      forwardAuthToken: true";

              line += ins;
            }

            output += line + "\n";
          }

          return output;
        }
        
       /*
        process: function(content) {

          var graph = new DepGraph({ circular: true });

          var yawn = new YAWN(String(content));

          // Get the json object of the parsed yaml
          var mta = yawn.json;

          // Manipulate the mta object

          // Insert the root into the graph
          graph.addNode('doc', mta.ID);
          graph.addNode('modules');
          graph.addDependency('doc', 'modules');
          graph.addNode('resources');
          graph.addDependency('modules','resources');

          // Assume there is a resources: section?
          mta.resources.forEach((resource, index) => {
            graph.addNode(resource.name, resource);
            graph.addDependency('resources',resource.name);
          });

          // Assume there is a modules: section?
          mta.modules.forEach((module, index) => {
            graph.addNode(module.name, module);
            graph.addDependency('modules',module.name);
          });

          // Set dependencies (from, to)
          mta.modules.forEach((module, index) => {
            if (typeof(module.requires) === "object") {
    
              // The module will either require a resource with that name or another module that 'provides' that name
              module.requires.forEach((req, idx) => {
    
                // Loop through the resources looking for it.
                mta.resources.forEach((resource, index) => {
                  //if (verbosity >= 2) { console.log("res[" + index + "]: " + resource.name + "\n"); }
                  if (req.name == resource.name) {
                    //if (verbosity >= 2) { console.log("mod[" + module.name + "] -> " + req.name + "\n"); }
                    graph.addDependency(req.name,resource.name);
                  }
                });
    
                // Loop through the modules looking for one that provides it.
                mta.modules.forEach((mod, index) => {
                  //if (verbosity >= 2) { console.log("mod[" + index + "]: " + mod.name + "\n"); }
                  //if (verbosity >= 2) { console.log(typeof(mod.provides)); }
                  if (typeof(mod.provides) === "object") {
                  mod.provides.forEach((prov, pidx) => {
                    if (req.name == prov.name) {
                      //if (verbosity >= 2) { console.log("mod[" + module.name + "] -> " + mod.name + "\n"); }
                      graph.addDependency(module.name,mod.name);
                    }
                  });
                  }
                });
    
              });
            }
          });

          var deps = graph.overallOrder();

          var routermodule = deps[deps.length-3];
          // Find the module with that routermodule name
          // Append a destination entry to it

          // Seems YAWN likes a bit different indentation style
          // Append a new module
          mta.modules.push( { 
            "name": "new-module", 
            "type": "python", 
            "path": "newbie",
            "routermodule": routermodule,
            "parameters": { 
              "domain": "trustedfilter.net",
              "routes": [ { "route": "this_way" }, { "route": 'that_way.${default-domain}' } ],
              "etc": "whatever"
            }
          } );          

          // Assign it back to the yawn object
          yawn.json = mta;

          return yawn.yaml;
        }
        */
      }
    );

    this.fs.copyTpl(
      this.destinationPath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("routes");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              ins = "";
              ins += "\n";
              indent = "    ";

              ins += indent + "{" + "\n";
              ins +=
                indent +
                '  "source": "(<?= module_route ?>/)(.*)",' +
                "\n";
              ins +=
                indent + '  "destination": "<?= module_be ?>",' + "\n";
              ins += indent + '  "csrfProtection": true,' + "\n";
              ins += indent + '  "authenticationType": "xsuaa"' + "\n";
              ins += indent + "},";

              line += ins;
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );

    this.fs.copyTpl(
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      this.destinationPath(this.answers.router_dir + "/xs-app.json"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("</body>");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              ins = "";
              ins += "\n";
              indent = "  ";

              ins +=
                indent +
                '<a href="/<?= module_route ?>/">/<?= module_route ?>/</a> link handled by <?= module_name ?><br />' +
                "\n" +
                "\n";

              line = ins + line;
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );

    this.fs.copyTpl(
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      this.destinationPath(this.answers.router_dir + "/resources/index.html"),
      subs,
      { delimiter: "?" }
    );
  }

  install() {
    //this.installDependencies();
  }

  end() {
    this.log(
      "\n The NodeJS module " +
        this.answers.module_name +
        " has be added to your project. \nDouble check your mta.yaml, " +
        this.answers.router_dir +
        "/xs-app.json" +
        ", and " +
        this.answers.router_dir +
        "/resources/index.html" +
        " files for issues."
    );
  }
};
