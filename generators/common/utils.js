/* eslint-disable camelcase */
// Utils.js
// ========
module.exports = {
  foo: function() {
    // Whatever
    var retval = "";
    retval = "foo!";
    return retval;
  },
  bar: function() {
    // Whatever
  },
  not_undef: function(str) {
    var retval = false;
    if (str === "undefined") {
      retval = false;
    } else {
      retval = true;
    }

    return retval;
  }
};

var zemba = function() {};
