const version = require("../package.json").version;

function init() {
  console.log("这是 @test/cli 包的入口文件，版本：" + version);
}
module.exports = init;
