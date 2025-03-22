const init = require("@test/libs");

init();
function hooked() {
  console.log("hooked");
}

module.exports = hooked;
