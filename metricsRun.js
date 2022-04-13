const fs = require("fs");
const { resolve } = require("path");
var { metric1 } = require("./metric1.js");
var { metric2 } = require("./metric2.js");
var { metric3 } = require("./metric3.js");
var DCGFilename = "";
var SCGFilename = "";
var inputDir = "";
var appfrmfiles = {};
var out = {};
var filesArr = [];
function met1() {
  return new Promise((resolve) => {
    var metout = metric1(DCGFilename, SCGFilename, inputDir, filesArr);
    if (out["metric1"] !== undefined) {
      resolve(metout);
    }
  });
}
function met2() {
  return new Promise((resolve) => {
    var metout = metric2(DCGFilename, SCGFilename, inputDir, filesArr);
    if (out["metric2"] !== undefined) {
      resolve(metout);
    }
  });
}
function met3() {
  return new Promise((resolve) => {
    var metout = metric3(DCGFilename, SCGFilename, inputDir, filesArr);
    if (out["metric3"] !== undefined) {
      resolve(metout);
    }
  });
}
async function main() {
  filesArr = appfrmfiles[name];
  //out["metric1"] = met1()
  //await metric1(DCGFilename,SCGFilename,inputDir,filesArr)
  //out["metric2"] = met2()
  //await metric2(DCGFilename,SCGFilename,inputDir,filesArr2)
  //out["metric3"] = met3()
  //await metric3(DCGFilename,SCGFilename,inputDir,filesArr3)
  const json = JSON.stringify(out, null, 2);
  filename = process.argv[3].replace(/SCG_/, "Metrics_");
  fs.writeFileSync(filename, json, "utf8", function (err) {
    if (err) console.log("error", err);
  });
}
function getInputs() {
  // Getting the inputs from console
  if (process.argv.length == 7) {
    DCGFilename = process.argv[2];
    SCGFilename = process.argv[3];
    inputDir = process.argv[4].toString();
    appfrmfiles = JSON.parse(fs.readFileSync(process.argv[5], "utf8"));
    name = process.argv[6];
    main();
  } else {
    console.log(
      "Please enter arguments in the following sequence:\n1:Dynamic Call graph File\n2:Static Call Graph File\n3:Directory of Javascript files\n4:Output Directory"
    );
  }
}

getInputs();
