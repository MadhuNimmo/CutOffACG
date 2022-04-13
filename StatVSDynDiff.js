var { processInputs } = require("./preprocess.js");
var Graph = require("./Graph.js");
const path = require("path");
const clonedeep = require("lodash.clonedeep");

const fs = require("fs");
var DCG = new Graph();
var SCG = new Graph();

function main() {
  [DCG, SCG, appFiles, frmFiles] = processInputs(
    DCGFilename,
    SCGFilename,
    inputDir,
    "EdgeDiff"
  );
  getEdgeDiff();
}

function getEdgeDiff() {
  // Identifying common edges between DCG and SCG
  DCG_keys = [...DCG.getKeys()];
  SCG_keys = [...SCG.getKeys()];
  var Mis_edges = clonedeep(DCG);

  for (var DCG_key of DCG_keys) {
    var DCG_values = DCG.getValues(DCG_key);
    for (DCG_value of DCG_values) {
      for (SCG_key of SCG_keys) {
        if (DCG_key === SCG_key || SCG_key.includes(DCG_key)) {
          for (SCG_value of SCG.getValues(SCG_key)) {
            if (DCG_value == SCG_value || SCG_value.includes(DCG_value)) {
              Mis_edges.removeEdge(DCG_key, DCG_value);
            }
          }
        }
      }
    }
  }
  //Writing the output to a file
  console.log(Mis_edges.getSize());
  const json = JSON.stringify(Mis_edges.getGraph(), null, 2);
  fs.writeFile(path.join(outPath, "diff.json"), json, "utf8", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(
        "The dynamic call edges missing from static call graph is saved in: " +
          path.join(outPath, "diff.json")
      );
    }
  });
  var csv = "";
  var x = Mis_edges.getGraph();
  for (key of Object.keys(x)) {
    for (val of x[key]) {
      csv += key + "," + val + "\n";
    }
  }
  fs.writeFileSync(path.join(outPath, "diff.csv"), csv, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function getInputs() {
  // Getting the inputs from console
  if (process.argv.length == 6) {
    DCGFilename = process.argv[2];
    SCGFilename = process.argv[3];
    inputDir = process.argv[4].toString();
    outPath = process.argv[5];
    main();
  } else {
    console.log(
      "Please enter arguments in the following sequence:\n1:Dynamic Call graph File\n2:Static Call Graph File\n3:Directory of Javascript files\n4:Output Directory"
    );
  }
}

getInputs();
