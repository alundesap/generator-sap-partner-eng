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
// const chalk = require("chalk");
// const yosay = require("yosay");
const YAWN = require("yawn-yaml/cjs");
const DepGraph = require("dependency-graph").DepGraph;

var utils = require("../common/utils");

global.globConfig = [];

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--force` flag
    this.option('force', {type: Boolean, default: false})
    this.option('instance-manager', {type: Boolean, default: false})

    // And you can then access it later; e.g.
    //this.scriptSuffix = this.options.force ? ".coffee" : ".js";
  }

  initializing() {
    this.props = {};
    this.answers = {};
    var the_app_name = "";
    if (typeof this.config.get("app_name") !== "undefined") {
      the_app_name = this.config.get("app_name");
    }

    var existing_database_name = this.config.get("database_name");
    if ((typeof existing_database_name !== "undefined") && (!this.options.force)) {
      this.log("WARNING: yo sap-partner-eng:db-hdb or :db-cap has already been run once for " + the_app_name + ".  Use the --force option to override.");
      // throw new Error("Aborting!");
      process.exit(1);
    }

    this.config.defaults({
      database_name: the_app_name + "-hdb",
      database_path: "db",
      db_schema_name: the_app_name.toUpperCase() + "_DB",
      hdi_res_name: the_app_name + "-hdi",
      hdi_svc_name: the_app_name.toUpperCase() + "_HDI",
      router_name: the_app_name + "-app",
      router_path: "app",
      services_type: "nodejs",
      java_package: "my.company",
      services_name: the_app_name + "-srv",
      services_path: "srv",
      services_api: the_app_name + "_svc_api",
      services_be: the_app_name + "_svc_be",
      services_route: "catalog",  // odata/v4/CatalogService
      tests_path: "integration-tests",
      multitenant_enabled: false,
      reg_res_name: the_app_name + "-reg",
      reg_svc_name: the_app_name.toUpperCase() + "_REG",
      mgd_res_name: the_app_name + "-smc",
      mgd_svc_name: the_app_name.toUpperCase() + "_SMC"
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

    this.log("Start Prompting.");
    this.log("What is: " + utils.foo());

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

    if (typeof this.config.get("router_name") === "undefined") {
      prompts.push({
        type: "input",
        name: "router_name",
        message: "Application router path",
        default: this.config.get("router_name")
      });
    } else {
      this.answers.router_name = this.config.get("router_name");
      this.log("Using router_name: " + this.answers.router_name);
    }

    if (typeof this.config.get("router_path") === "undefined") {
      prompts.push({
        type: "input",
        name: "router_path",
        message: "Application router path",
        default: this.config.get("router_path")
      });
    } else {
      this.answers.router_path = this.config.get("router_path");
      this.log("Using router_path: " + this.answers.router_path);
    }

    if (typeof this.config.get("database_path") === "undefined") {
      prompts.push({
        type: "input",
        name: "database_path",
        message: "Application database path",
        default: this.config.get("database_path")
      });
    } else {
      this.answers.database_path = this.config.get("database_path");
      this.log("Using database_path: " + this.answers.database_path);
    }

    prompts.push({
      type: "input",
      name: "database_name",
      message: "DB Module Name.",
      default: this.config.get("database_name")
    });

    prompts.push({
      type: "input",
      name: "db_schema_name",
      prefix:
        "Leave this blank if you want the system to generate the schema name(blank for multitenancy).\n",
      message: "DB Schema Name.",
      //default: this.config.get("db_schema_name")
      default: ""
    });

    prompts.push({
      type: "input",
      name: "hdi_res_name",
      message: "HDI resource name",
      default: this.config.get("hdi_res_name")
    });

    // eslint-disable-next-line no-constant-condition
    if (true) {
      prompts.push({
        type: "list",
        name: "services_type",
        prefix: "Implement the service module as nodejs/(java) module type.\n",
        message: "Module type.",
        choices: ["nodejs", "java"],
        default: this.config.get("services_type")
      });

      prompts.push({
        type: "input",
        name: "java_package",
        message: "Registry Resource Name.",
        default: this.config.get("java_package"),
        when: function(so_far) {
          var retval = false;
          if (so_far.services_type === "java") {
            retval = true;
          } else {
            retval = false;
          }
          return retval;
        }
      });
    }

    if (typeof this.config.get("services_path") === "undefined") {
      prompts.push({
        type: "input",
        name: "services_path",
        message: "Application services path",
        default: this.config.get("services_path")
      });
    } else {
      this.answers.services_path = this.config.get("services_path");
      this.log("Using services_path: " + this.answers.services_path);
    }

    prompts.push({
      type: "input",
      name: "hdi_svc_name",
      message: "HDI service name.",
      default: this.config.get("hdi_svc_name")
    });

    prompts.push({
      type: "input",
      name: "services_name",
      message: "Services Module Name.",
      default: this.config.get("services_name")
    });

    prompts.push({
      type: "input",
      name: "services_api",
      message: "Services Module API (Internal Reference).",
      default: this.config.get("services_api")
    });

    prompts.push({
      type: "input",
      name: "services_be",
      message: "Services Module Back End (AppRouter Destination).",
      default: this.config.get("services_be")
    });

    prompts.push({
      type: "input",
      name: "services_route",
      message: "Route path(after first /) that your module will handle",
      //default: this.config.get("services_route")
      default: function(so_far) {
        var retval = "catalog";
        if (so_far.services_type === "java") {
          retval = "odata/v4/CatalogService";
        }
        return retval;
      }
    });

    prompts.push({
      type: "input",
      name: "tests_path",
      message: "Path for java integration tests.",
      default: this.config.get("tests_path"),
      when: function(so_far) {
        var retval = false;
        if (so_far.services_type === "java") {
          retval = true;
        }

        return retval;
      }
    });

    prompts.push({
      type: "confirm",
      name: "multitenant_enabled",
      message: "Use this NodeJS module to handle CDS-MTX style subscription requests?",
      default: this.config.get("multitenant_enabled")
      // when: function () {
      //   var retval = false;
      //   var enabled = globConfig.get("multitenant_enabled");
      //   if (enabled) {
      //     retval = false;
      //   }
      //   else {
      //     retval = true;
      //   }
      //   return retval;
      // }
    });

    prompts.push({
      type: "input",
      name: "reg_res_name",
      message: "Registry Resource Name.",
      default: this.config.get("reg_res_name"),
      when: function(so_far) {
        var retval = false;
        //var enabled = globConfig.get("multitenant_enabled");
        if (so_far.multitenant_enabled) {
          retval = true;
        } else {
          retval = false;
        }

        return retval;
      }
    });

    prompts.push({
      type: "input",
      name: "reg_svc_name",
      message: "Registry Service Name.",
      default: this.config.get("reg_svc_name"),
      when: function(so_far) {
        var retval = false;
        //var enabled = globConfig.get("multitenant_enabled");
        if (so_far.multitenant_enabled) {
          retval = true;
        } else {
          retval = false;
        }

        return retval;
      }

    });

    prompts.push({
      type: "input",
      name: "mgd_res_name",
      message: "Managed(HDI) Resource Name.",
      default: this.config.get("mgd_res_name"),
      when: function(so_far) {
        var retval = false;
        //var enabled = globConfig.get("multitenant_enabled");
        if (so_far.multitenant_enabled) {
          retval = true;
        } else {
          retval = false;
        }

        return retval;
      }
    });

    prompts.push({
      type: "input",
      name: "mgd_svc_name",
      message: "Managed(HDI) Service Name.",
      default: this.config.get("mgd_svc_name"),
      when: function(so_far) {
        var retval = false;
        //var enabled = globConfig.get("multitenant_enabled");
        if (so_far.multitenant_enabled) {
          retval = true;
        } else {
          retval = false;
        }

        return retval;
      }

    });

    this.answers = await this.prompt(prompts);

    if (typeof this.config.get("app_name") !== "undefined") {
      this.answers.app_name = this.config.get("app_name");
    }

    if (typeof this.config.get("router_name") !== "undefined") {
      this.answers.router_name = this.config.get("router_name");
    }

    if (typeof this.config.get("router_path") !== "undefined") {
      this.answers.router_path = this.config.get("router_path");
    }

    if (typeof this.config.get("database_name") !== "undefined") {
      this.answers.database_name = this.config.get("database_name");
    }

    if (typeof this.config.get("database_path") !== "undefined") {
      this.answers.database_path = this.config.get("database_path");
    }

    if (typeof this.config.get("services_name") !== "undefined") {
      this.answers.services_name = this.config.get("services_name");
    }

    if (typeof this.config.get("java_package") !== "undefined") {
      this.answers.java_package = this.config.get("java_package");
    }
    else {
      this.answers.java_package = "my.company";
    }

    if (typeof this.config.get("services_path") !== "undefined") {
      this.answers.services_path = this.config.get("services_path");
    }

    if (typeof this.config.get("tests_path") !== "undefined") {
      this.answers.tests_path = this.config.get("tests_path");
    }

    if (typeof this.config.get("domain_name") !== "undefined") {
      this.answers.domain_name = this.config.get("domain_name");
      this.log("Using domain_name: " + this.answers.domain_name);
    }

    if (typeof this.config.get("uaa_res_name") !== "undefined") {
      this.answers.uaa_res_name = this.config.get("uaa_res_name");
      this.log("Using uaa_res_name: " + this.answers.uaa_res_name);
    }
  }

  writing() {
    this.config.set("database_name", this.answers.database_name);
    this.config.set("database_path", this.answers.database_path);
    this.config.set("db_schema_name", this.answers.db_schema_name);
    this.config.set("hdi_res_name", this.answers.hdi_res_name);
    this.config.set("hdi_svc_name", this.answers.hdi_svc_name);
    this.config.set("services_name", this.answers.services_name);
    this.config.set("services_type", this.answers.services_type);
    this.config.set("java_package", this.answers.java_package);
    this.config.set("services_path", this.answers.services_path);
    this.config.set("services_api", this.answers.services_api);
    this.config.set("services_be", this.answers.services_be);
    this.config.set("services_route", this.answers.services_route);
    this.config.set("tests_path", this.answers.tests_path);
    this.config.set("router_name", this.answers.router_name);
    this.config.set("router_path", this.answers.router_path);

    if (typeof this.answers.multitenant_enabled !== "undefined") {
      this.config.set("multitenant_enabled", this.answers.multitenant_enabled);

      if (this.answers.multitenant_enabled) {
        this.config.set("multitenant_module", this.answers.module_name);
        this.config.set("reg_res_name", this.answers.reg_res_name);
        this.config.set("reg_svc_name", this.answers.reg_svc_name);
        this.config.set("mgd_res_name", this.answers.mgd_res_name);
        this.config.set("mgd_svc_name", this.answers.mgd_svc_name);
      } else {
        this.config.delete("reg_res_name");
        this.config.delete("reg_svc_name");
        this.config.delete("mgd_res_name");
        this.config.delete("mgd_svc_name");
      }
    }

    globConfig.set("services_type",this.answers.services_type);

    this.config.save();

    var java_path = this.answers.java_package.replace(".", "/");
    var subs = {
      app_name: this.answers.app_name,
      router_name: this.answers.router_name,
      database_name: this.answers.database_name,
      database_path: this.answers.database_path,
      db_schema_name: this.answers.db_schema_name,
      hdi_res_name: this.answers.hdi_res_name,
      hdi_svc_name: this.answers.hdi_svc_name,
      services_name: this.answers.services_name,
      services_type: this.answers.services_type,
      java_package: this.answers.java_package,
      java_path: java_path,
      services_path: this.answers.services_path,
      services_api: this.answers.services_api,
      services_be: this.answers.services_be,
      services_route: this.answers.services_route,
      tests_path: this.answers.tests_path,
      domain_name: this.answers.domain_name,
      uaa_res_name: this.answers.uaa_res_name,
      reg_res_name: this.answers.reg_res_name,
      reg_svc_name: this.answers.reg_svc_name,
      mgd_res_name: this.answers.mgd_res_name,
      mgd_svc_name: this.answers.mgd_svc_name
    };

    // .cdsrc.json and package.json are being
    // provided by the main app generator now
    // this.fs.copyTpl(
    //   this.templatePath(".cdsrc.json"),
    //   this.destinationPath(".cdsrc.json"),
    //   subs
    // );

    // this.fs.copyTpl(
    //   this.templatePath("package.json"),
    //   this.destinationPath("package.json"),
    //   subs
    // );

    this.fs.copyTpl(
      this.templatePath("db/build.js"),
      this.destinationPath(this.answers.database_path + "/.build.js"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("db/data-model.cds"),
      this.destinationPath(this.answers.database_path + "/data-model.cds"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("db/package.json.gen"),
      this.destinationPath(this.answers.database_path + "/package.json"),
      subs
    );

    this.fs.copy(
      this.templatePath("db/csv/my.bookshop-Authors.csv"),
      this.destinationPath(this.answers.database_path + "/csv/my.bookshop-Authors.csv")
    );

    this.fs.copy(
      this.templatePath("db/csv/my.bookshop-Books.csv"),
      this.destinationPath(this.answers.database_path + "/csv/my.bookshop-Books.csv")
    );

    this.fs.copy(
      this.templatePath("db/csv/my.bookshop-Orders.csv"),
      this.destinationPath(this.answers.database_path + "/csv/my.bookshop-Orders.csv")
    );

    this.fs.copyTpl(
      this.templatePath("srv/build.js"),
      this.destinationPath(this.answers.services_path + "/.build.js"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("srv/cat-service.cds"),
      this.destinationPath(this.answers.services_path + "/cat-service.cds"),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("srv/cat-service-auth.cds"),
      this.destinationPath(this.answers.services_path + "/cat-service-auth.cds"),
      subs
    );

    if (this.answers.services_type === "nodejs") {
      this.fs.copyTpl(
        this.templatePath("srv/CDS-MTX.md"),
        this.destinationPath(this.answers.services_path + "/CDS-MTX.md"),
        subs
      );

      if (this.answers.multitenant_enabled) {
        this.fs.copyTpl(
          this.templatePath("srv/server.js.mt"),
          this.destinationPath(this.answers.services_path + "/server.js"),
          subs
        );
      } else {
        this.fs.copyTpl(
          this.templatePath("srv/server.js"),
          this.destinationPath(this.answers.services_path + "/server.js"),
          subs
        );
      }

      if (this.answers.multitenant_enabled) {
        this.fs.copyTpl(
          this.templatePath("srv/handlers/provisioning.js"),
          this.destinationPath(this.answers.services_path + "/handlers/provisioning.js"),
          subs
        );
      }

      if (this.answers.multitenant_enabled) {
        this.fs.copyTpl(
          this.templatePath("srv/package.json.mt"),
          this.destinationPath(this.answers.services_path + "/package.json"),
          subs
        );
      } else {
        this.fs.copyTpl(
          this.templatePath("srv/package.json.gen"),
          this.destinationPath(this.answers.services_path + "/package.json"),
          subs
        );
      }
    } else {
      this.fs.copyTpl(
        this.templatePath("pom.xml"),
        this.destinationPath("pom.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("srv/pom.xml"),
        this.destinationPath(this.answers.services_path + "/pom.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("srv/package.json.java"),
        this.destinationPath(this.answers.services_path + "/package.json"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("srv/src/main/java/" + "my/company" + "/OrdersService.java"),
        this.destinationPath(this.answers.services_path + "/src/main/java/" + java_path + "/OrdersService.java"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("srv/src/main/resources/application.properties"),
        this.destinationPath(this.answers.services_path + "/src/main/resources/application.properties"),
        subs
      );

      this.fs.copy(
        this.templatePath("srv/src/main/resources/connection.properties"),
        this.destinationPath(this.answers.services_path + "/src/main/resources/connection.properties")
      );

      this.fs.copy(
        this.templatePath("srv/src/main/resources/edmx/dummyfile.txt"),
        this.destinationPath(this.answers.services_path + "/src/main/resources/edmx/dummyfile.txt")
      );

      this.fs.copy(
        this.templatePath("srv/src/main/resources/i18n/i18n.properties"),
        this.destinationPath(this.answers.services_path + "/src/main/resources/i18n/i18n.properties")
      );

      this.fs.copy(
        this.templatePath("srv/src/main/resources/log4j.properties"),
        this.destinationPath(this.answers.services_path + "/src/main/resources/log4j.properties")
      );

      this.fs.copy(
        this.templatePath("srv/src/main/webapp/META-INF/context.xml"),
        this.destinationPath(this.answers.services_path + "/src/main/webapp/META-INF/context.xml")
      );

      this.fs.copyTpl(
        this.templatePath("srv/src/main/webapp/META-INF/sap_java_buildpack/config/resource_configuration.yml"),
        this.destinationPath(this.answers.services_path + "/src/main/webapp/META-INF/sap_java_buildpack/config/resource_configuration.yml"),
        subs
      );

      this.fs.copy(
        this.templatePath("srv/src/main/webapp/WEB-INF/resources.xml"),
        this.destinationPath(this.answers.services_path + "/src/main/webapp/WEB-INF/resources.xml")
      );

      this.fs.copy(
        this.templatePath("srv/src/main/webapp/WEB-INF/spring-security.xml"),
        this.destinationPath(this.answers.services_path + "/src/main/webapp/WEB-INF/spring-security.xml")
      );

      this.fs.copy(
        this.templatePath("srv/src/main/webapp/WEB-INF/web.xml"),
        this.destinationPath(this.answers.services_path + "/src/main/webapp/WEB-INF/web.xml")
      );

      this.fs.copy(
        this.templatePath("srv/src/test/java/" + "my/company" + "/dummyfile.txt"),
        this.destinationPath(this.answers.services_path + "/src/test/java/" + java_path + "/dummyfile.txt")
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/pom.xml"),
        this.destinationPath(this.answers.tests_path + "/pom.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/src/test/resources/arquillian.xml"),
        this.destinationPath(this.answers.tests_path + "/src/test/resources/arquillian.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/src/test/resources/resources.xml"),
        this.destinationPath(this.answers.tests_path + "/src/test/resources/resources.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/src/test/resources/spring-security.xml"),
        this.destinationPath(this.answers.tests_path + "/src/test/resources/spring-security.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/src/test/resources/web.xml"),
        this.destinationPath(this.answers.tests_path + "/src/test/resources/web.xml"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/src/test/java/" + "my/company" + "/OrderServiceTest.java"),
        this.destinationPath(this.answers.tests_path + "/src/test/java/" + java_path + "/OrderServiceTest.java"),
        subs
      );

      this.fs.copyTpl(
        this.templatePath("integration-tests/src/test/java/" + "my/company" + "/TestUtil.java"),
        this.destinationPath(this.answers.tests_path + "/src/test/java/" + java_path + "/TestUtil.java"),
        subs
      );

    }

    // this.fs.copyTpl(
    //   this.templatePath("cds-security.json"),
    //   this.destinationPath("cds-security.json"),
    //   subs
    // );
    //globConfig.set("ins_multitenant",true);
    this.fs.copy(
      this.destinationPath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var enabled = globConfig.get("multitenant_enabled");
          var services_type = globConfig.get("services_type");
 
          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            var line = lines[i - 1];
            var pos = line.search("### New Modules Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              var ins = "";
              ins += "\n\n";
              ins += indent + "# cf push <?= database_name ?> -p <?= database_path ?> -k 512M -m 512M" + "\n";
              ins += indent + " - name: <?= database_name ?>" + "\n";
              ins += indent + "   type: hdb" + "\n";
              ins += indent + "   path: <?= database_path ?>" + "\n";
              ins += indent + "   build-parameters:" + "\n";
              ins += indent + "      # Don't package the dependencies if you're running into EINTEGRITY issues" + "\n";
              ins += indent + "      ignore: [\"default-env.json\",\"package-lock.json\", \"node_modules/\"]" + "\n";
              ins += indent + "      # Suppress the calling of npm install by listing no commands" + "\n";
              ins += indent + "      builder: custom" + "\n";
              ins += indent + "      commands: []" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 512M" + "\n";
              ins += indent + "      disk-quota: 512M" + "\n";
              // ins += indent + "      #host: ${org}-${space}-<?= database_name ?>" + "\n";
              // ins += indent + "      #domain: <?= domain_name ?>" + "\n";
              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= hdi_res_name ?>";

              ins += "\n\n";
              var mem_size = "512M";
              var disk_size = "1024M";
              if (services_type === "java") {
                mem_size = "1024M";
              }

              ins += indent + "# cf push <?= services_name ?> -p <?= services_path ?> -n ${org}-${space}-<?= services_name ?> -d <?= domain_name ?> -k " + disk_size + " -m " + mem_size + "" + "\n";
              ins += indent + " - name: <?= services_name ?>" + "\n";
              ins += indent + "   type: <?= services_type ?>" + "\n";
              if (services_type === "nodejs") {
                ins += indent + "   build-parameters:" + "\n";
                ins += indent + "      # Don't package the dependencies if you're running into EINTEGRITY issues" + "\n";
                ins += indent + "      ignore: [\"default-env.json\",\"package-lock.json\", \"node_modules/\"]" + "\n";
                ins += indent + "      # Suppress the calling of npm install by listing no commands" + "\n";
                ins += indent + "      builder: custom" + "\n";
                ins += indent + "      commands: []" + "\n";
                }
              ins += indent + "   path: <?= services_path ?>" + "\n";
              if (services_type === "nodejs") {
                ins += indent + "   properties:" + "\n";
                ins += indent + "      LOG_LEVEL: debug" + "\n";
                ins += indent + "      EXIT: 1  # required by deploy.js task to terminate" + "\n";
                ins += indent + "      SAP_JWT_TRUST_ACL: [{\"clientid\":\"*\",\"identityzone\":\"sap-provisioning\"}]  # Trust between server and SaaS Manager" + "\n";
                ins += indent + "      NODE_DEBUG: 'instance-manager'" + "\n";
                ins += indent + "      # cf set-env mtxsm-srv CF_API_USER 'user@domain.com'" + "\n";
                ins += indent + "      # cf set-env mtxsm-srv CF_API_PW 'xxxxxx'" + "\n";
                ins += indent + "      # cf restage mtxsm-srv" + "\n";
                ins += indent + "      CF_API_USER: user@domain.com" + "\n";
                ins += indent + "      CF_API_PW: xxxxxx" + "\n";
             }
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: " + mem_size + "" + "\n";
              ins += indent + "      disk-quota: " + disk_size + "" + "\n";
              ins += indent + "      #host: ${org}-${space}-<?= services_name ?>" + "\n";
              ins += indent + "      #domain: <?= domain_name ?>" + "\n";
              ins += indent + "   provides:" + "\n";
              ins += indent + "    - name: <?= services_api ?>" + "\n";
              ins += indent + "      properties:" + "\n";
              ins += indent + "         url: ${default-url}" + "\n";

              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= hdi_res_name ?>" + "\n";
              if (services_type === "java") {
                //JBP_CONFIG_RESOURCE_CONFIGURATION: '[tomcat/webapps/ROOT/META-INF/context.xml:
                //  {"service_name_for_DefaultDB" : "~{hdi-container-name}"}]'
                ins += indent + "      properties:" + "\n";
                ins += indent + "         JBP_CONFIG_RESOURCE_CONFIGURATION: '[tomcat/webapps/ROOT/META-INF/context.xml:" + "\n";
                ins += indent + "            {\"service_name_for_DefaultDB\" : \"<?= hdi_svc_name ?>\"}]'" + "\n";
              }
              ins += indent + "    - name: <?= uaa_res_name ?>";
              if (enabled) {
                ins += indent + "\n" + "    - name: <?= reg_res_name ?>";
                ins += indent + "\n" + "    - name: <?= mgd_res_name ?>" + "\n";
              }

              line += ins;
            }

// # CDS-MTX
// #   properties:
// #      TENANT_HOST_PATTERN: '^(.*).cfapps.us10.hana.ondemand.com'

            pos = line.search("# CDS-MTX");
            if (pos !== -1) {
              ins = "";
              //output += "###indent=" + pos + '\n';
              indent = "";
              ins += "\n";

              for (var j = 0; j < pos; j++) {
                indent += " ";
              }
              if (enabled) {
                ins += indent + "   properties:" + "\n";
                ins += indent + "      TENANT_HOST_PATTERN: '^(.*)-${space}-${app-name}.<?= domain_name ?>'";

                line += ins;
              }
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

              ins += indent + " - name: <?= services_api ?>" + "\n";
              ins += indent + "   group: destinations" + "\n";
              ins += indent + "   properties:" + "\n";
              ins += indent + "      name: <?= services_be ?>" + "\n";
              ins += indent + "      url: ~{url}" + "\n";
              ins += indent + "      forwardAuthToken: true";

              line += ins;
            }

            var pos = line.search("### New Resources Here ###");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              var indent = "";
              for (var j = 0; j < pos; j++) {
                indent += " ";
              }

              var ins = "";
              ins += "\n\n";

              //# cf create-service xsuaa application YO_UAA -c ./xs-security.json
              ins += indent + "# cf create-service hana hdi-shared <?= hdi_svc_name ?> -c '{\"config\":{\"schema\":\"<?= db_schema_name ?>\"}}'" + "\n";
              ins += indent + " - name: <?= hdi_res_name ?>" + "\n";
              ins += indent + "   type: com.sap.xs.hdi-container" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      service-name: <?= hdi_svc_name ?>" + "\n";
              ins += indent + "      config:" + "\n";
              ins += indent + "         schema: <?= db_schema_name ?>";

              if (enabled) {
                ins += "\n";
                ins += "\n";
  
                ins += indent + "# CAP-MTX Managed HANA (Internal Service Manager)" + "\n";
                ins += indent + " - name: <?= mgd_res_name ?>" + "\n";
                ins += indent + "   type: org.cloudfoundry.managed-service" + "\n";
                ins += indent + "   requires:" + "\n";
                ins += indent + "    - name: <?= uaa_res_name ?>" + "\n";
                ins += indent + "   parameters:" + "\n";
                ins += indent + "      service: service-manager" + "\n";
                ins += indent + "      service-plan: container" + "\n";
                ins += indent + "      service-name: <?= mgd_svc_name ?>" + "\n";
                ins += indent + "      polling_timeout_seconds: 240" + "\n";

                ins += "\n";

                ins += indent + "# Multitenant Registration(using CAP-MTX style url)" + "\n";
                ins += indent + "# Manually add route after tenant subscription" + "\n";
                ins += indent + "# cf map-route <?= router_name ?> <?= domain_name ?> --hostname xxxmtxsmsbi-dev-<?= router_name ?>" + "\n";
                ins += indent + " - name: <?= reg_res_name ?>" + "\n";
                ins += indent + "   type: org.cloudfoundry.managed-service" + "\n";
                ins += indent + "   requires:" + "\n";
                ins += indent + "    - name: <?= uaa_res_name ?>" + "\n";
                ins += indent + "   parameters:" + "\n";
                ins += indent + "      service: saas-registry" + "\n";
                ins += indent + "      service-plan: application" + "\n";
                ins += indent + "      service-name: <?= reg_svc_name ?>" + "\n";
                ins += indent + "      config:" + "\n";
                ins += indent + "         xsappname: ~{<?= uaa_res_name ?>/XSAPPNAME}" + "\n";
                ins += indent + "         appName: <?= app_name ?>" + "\n";
                ins += indent + "         displayName: <?= app_name ?>" + "\n";
                ins += indent + "         description: '<?= app_name ?> Multitenant App'" + "\n";
                ins += indent + "         category: '<?= app_name ?> Category'" + "\n";
                ins += indent + "         appUrls:" + "\n";
                ins += indent + "            onSubscription: https://${org}-${space}-<?= services_name ?>.<?= domain_name ?>/mtx/v1/provisioning/tenant/{tenantId}" + "\n";
                ins += indent + "            onSubscriptionAsync: false" + "\n";
                ins += indent + "            onUnSubscriptionAsync: false" + "\n";
                ins += indent + "            #callbackTimeoutMillis: 300000" + "\n";
  
                ins += "\n";

              }
              line += ins;
            }

            // Value replacements
            if (enabled) {
              pos = line.search("tenant-mode: dedicated");
              if (pos !== -1) {
                line = line.replace("tenant-mode: dedicated", "tenant-mode: shared");
              }
            }

            output += line + "\n";
          }

          return output;
        }
      }
    );

    this.fs.copyTpl(
      this.destinationPath("mta.yaml"),
      this.destinationPath("mta.yaml"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath(this.answers.router_path + "/xs-app.json"),
      this.destinationPath(this.answers.router_path + "/xs-app.json"),
      {
        process: function(content) {
          // var output = "typeof(content) : " + typeof(content);
          var output = "";
          var line = "";
          var pos = 0;
          var indent = "";
          var ins = "";

          var enabled = globConfig.get("multitenant_enabled");

          var lines = String(content).split("\n");
          for (var i = 1; i <= lines.length; i++) {
            line = lines[i - 1];
            pos = line.search("routes");
            if (pos !== -1) {
              //output += "###indent=" + pos + '\n';
              ins = "";
              ins += "\n";
              indent = "    ";

              if (enabled) {
                ins += indent + "{" + "\n";
                ins += indent + '  "source": "(mtx/v1/provisioning/tenant/)(.*)",' + "\n";
                ins += indent + '  "destination": "<?= services_be ?>",' + "\n";
                ins += indent + '  "httpMethods": ["GET", "PUT", "DELETE"],' + "\n";
                ins += indent + '  "csrfProtection": true,' + "\n";
                ins += indent + '  "authenticationType": "none"' + "\n";
                ins += indent + "}," + "\n";

                ins += indent + "{" + "\n";
                ins += indent + '  "source": "(srv/)(.*)",' + "\n";
                ins += indent + '  "destination": "<?= services_be ?>",' + "\n";
                ins += indent + '  "csrfProtection": true,' + "\n";
                ins += indent + '  "authenticationType": "xsuaa"' + "\n";
                ins += indent + "}," + "\n";

              }

              ins += indent + "{" + "\n";
              ins += indent + '  "source": "(<?= services_route ?>/)(.*)",' + "\n";
              ins += indent + '  "destination": "<?= services_be ?>",' + "\n";
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
      this.destinationPath(this.answers.router_path + "/xs-app.json"),
      this.destinationPath(this.answers.router_path + "/xs-app.json"),
      subs,
      { delimiter: "?" }
    );

    this.fs.copy(
      this.destinationPath(this.answers.router_path + "/resources/index.html"),
      this.destinationPath(this.answers.router_path + "/resources/index.html"),
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
                '<a href="/<?= services_route ?>/">/<?= services_route ?>/</a> link handled by <?= services_name ?><br />' +
                "\n" +
                '<a href="/<?= services_route ?>/Authors?$expand=books($select=ID,title)">/<?= services_route ?>/Authors?$expand=books($select=ID,title)</a> link handled by <?= services_name ?><br />' +
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
      this.destinationPath(this.answers.router_path + "/resources/index.html"),
      this.destinationPath(this.answers.router_path + "/resources/index.html"),
      subs,
      { delimiter: "?" }
    );
  }

  install() {
    //this.installDependencies();
  }

  end() {
    this.log(
      "Be sure to add " +
        this.answers.hdi_res_name +
        " to the requires: section of any existing module that needs access to the HANA service instance " +
        this.answers.hdi_svc_name +
        "."
    );
  }
};
