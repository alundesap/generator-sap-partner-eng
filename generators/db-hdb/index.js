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

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--force` flag
    this.option('force', {type: Boolean, default: false})

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
      sampledata_provided: false,
      hanacloud_compatible: true
    });

  }

  async prompting() {
    // Have Yeoman greet the user.
    //this.log(
    //  yosay(`Welcome to the fabulous ${chalk.red('generator-sap-a-team-haa')} generator!`)
    //);

    //this.log("Options:" + JSON.stringify(this.options.app_name));
    //this.log("Config:" + this.config.get("app_name"));
    //this.log("Config Typeof:" + typeof(this.config.get("app_name")));

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

    prompts.push({
      type: "input",
      name: "database_name",
      message: "DB Module Name.",
      default: this.config.get("database_name")
    });

    prompts.push({
      type: "input",
      name: "database_path",
      message: "DB Module path.",
      default: this.config.get("database_path")
    });

    prompts.push({
      type: "input",
      name: "db_schema_name",
      prefix:
        "Leave this blank if you want the system to generate the schema name.\n",
      message: "DB Schema Name.",
      default: this.config.get("db_schema_name")
    });

    prompts.push({
      type: "input",
      name: "hdi_res_name",
      message: "HDI resource name",
      default: this.config.get("hdi_res_name")
    });

    prompts.push({
      type: "input",
      name: "hdi_svc_name",
      message: "HDI service name.",
      default: this.config.get("hdi_svc_name")
    });

    prompts.push({
      type: "confirm",
      name: "sampledata_provided",
      message: "Would you like a sample table/view in the HDI container?",
      default: this.config.get("sampledata_provided")
    });

    prompts.push({
      type: "confirm",
      name: "hanacloud_compatible",
      message: "HANACloud(hdbtable) compatible? = Y, else HDBCDS style? = N",
      default: this.config.get("hanacloud_compatible"),
      when: function(so_far) {
        var retval = false;
        if (so_far.sampledata_provided) {
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

    if (typeof this.config.get("domain_name") !== "undefined") {
      this.answers.domain_name = this.config.get("domain_name");
      this.log("Using domain_name: " + this.answers.domain_name);
    }


  }

  writing() {
    this.config.set("database_name", this.answers.database_name);
    this.config.set("database_path", this.answers.database_path);
    this.config.set("db_schema_name", this.answers.db_schema_name);
    this.config.set("hdi_res_name", this.answers.hdi_res_name);
    this.config.set("hdi_svc_name", this.answers.hdi_svc_name);

    if (typeof this.answers.sampledata_provided !== "undefined") {
      this.config.set("sampledata_provided", this.answers.sampledata_provided);

      if (this.answers.sampledata_provided) {
        this.config.set("sampledata_provided", this.answers.sampledata_provided);
        this.config.set("hanacloud_compatible", this.answers.hanacloud_compatible);
      } else {
        this.config.delete("sampledata_provided");
        this.config.delete("hanacloud_compatible");
      }
    }

    this.config.save();

    var subs = {
      app_name: this.answers.app_name,
      database_name: this.answers.database_name,
      database_path: this.answers.database_path,
      db_schema_name: this.answers.db_schema_name,
      hdi_res_name: this.answers.hdi_res_name,
      hdi_svc_name: this.answers.hdi_svc_name,
      domain_name: this.answers.domain_name
    };

    this.fs.copy(
      this.templatePath("db/package.json"),
      this.destinationPath(this.answers.database_path + "/package.json")
    );

    this.fs.copy(
      this.templatePath("db/src/.hdiconfig"),
      this.destinationPath(this.answers.database_path + "/src/.hdiconfig")
    );
    this.fs.copy(
      this.templatePath("db/src/.hdinamespace"),
      this.destinationPath(this.answers.database_path + "/src/.hdinamespace")
    );

    this.fs.copyTpl(
      this.templatePath("db/src/defaults/default_access_role.hdbrole"),
      this.destinationPath(
        this.answers.database_path + "/src/defaults/default_access_role.hdbrole"
      ),
      subs
    );

    this.fs.copyTpl(
      this.templatePath("db/src/roles/app_name_admin.hdbrole"),
      this.destinationPath(
        this.answers.database_path +
          "/src/roles/" +
          this.answers.app_name +
          "_admin.hdbrole"
      ),
      subs
    );

    this.fs.copy(
      this.templatePath("db/src/data/.hdinamespace"),
      this.destinationPath(this.answers.database_path + "/src/data/.hdinamespace")
    );

    if (this.answers.sampledata_provided) {
      if (this.answers.hanacloud_compatible) {
        this.fs.copy(
          this.templatePath("db/src/data/sensors_temp.hdbtable"),
          this.destinationPath(this.answers.database_path + "/src/data/sensors_temp.hdbtable")
        );

        this.fs.copy(
          this.templatePath("db/src/data/sensors_tempNoTimestamp.hdbview"),
          this.destinationPath(this.answers.database_path + "/src/data/sensors_tempNoTimestamp.hdbview")
        );

      } else {
        this.fs.copy(
          this.templatePath("db/src/data/sensors.hdbcds"),
          this.destinationPath(this.answers.database_path + "/src/data/sensors.hdbcds")
        );
      }

      this.fs.copy(
        this.templatePath("db/src/data/temp.csv"),
        this.destinationPath(this.answers.database_path + "/src/data/temp.csv")
      );
      this.fs.copy(
        this.templatePath("db/src/data/temp.hdbtabledata"),
        this.destinationPath(this.answers.database_path + "/src/data/temp.hdbtabledata")
      );
      this.fs.copy(
        this.templatePath("db/src/data/tempId.hdbsequence"),
        this.destinationPath(this.answers.database_path + "/src/data/tempId.hdbsequence")
      );

      this.fs.copy(
        this.templatePath("db/src/views/temps.hdbcalculationview"),
        this.destinationPath(
          this.answers.database_path + "/src/views/temps.hdbcalculationview"
        )
      );
    }

    this.fs.copy(
      this.templatePath("db/src/data/sys.hdbsynonym"),
      this.destinationPath(this.answers.database_path + "/src/data/sys.hdbsynonym")
    );
 

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
              ins += indent + "# cf push <?= database_name ?> -p <?= database_path ?> -k 512M -m 512M -u none ; sleep 60 ; cf stop <?= database_name ?>" + "\n";
              ins += indent + " - name: <?= database_name ?>" + "\n";
              ins += indent + "   type: hdb" + "\n";
              ins += indent + "   path: <?= database_path ?>" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      memory: 512M" + "\n";
              ins += indent + "      disk-quota: 512M" + "\n";
              ins += indent + "      #host: ${org}-${space}-<?= database_name ?>" + "\n";
              ins += indent + "      #domain: <?= domain_name ?>" + "\n";
              ins += indent + "   requires:" + "\n";
              ins += indent + "    - name: <?= hdi_res_name ?>";

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

              ins += indent + " - name: <?= hdi_res_name ?>" + "\n";
              ins += indent + "   type: com.sap.xs.hdi-container" + "\n";
              ins += indent + "   parameters:" + "\n";
              ins += indent + "      service-name: <?= hdi_svc_name ?>" + "\n";
              ins += indent + "      config:" + "\n";
              ins += indent + "         schema: <?= db_schema_name ?>";

              line += ins;
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
