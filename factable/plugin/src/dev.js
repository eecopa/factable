const fs = require("fs");
const path = require("path");
const babel = require("babel-core");
const cardinal = require("cardinal");
const plugin = require(".");

// read the filename from the command line arguments
// var fileName = process.argv[2];
const resolvePath = (p) => path.resolve(__dirname, p);

// read the code from this file
fs.readFile(resolvePath("../tests/fixtures/first-test/code.js"), function (
  err,
  data
) {
  if (err) throw err;

  // convert from a buffer to a string
  var src = data.toString();

  // use our plugin to transform the source
  var out = babel.transform(src, {
    plugins: [plugin],
  });

  console.log("--------- INPUT -----------");
  console.log();
  console.log(cardinal.highlight(src));
  console.log();
  console.log("--------- OUTPUT -----------");
  console.log();
  console.log(cardinal.highlight(out.code));
});
