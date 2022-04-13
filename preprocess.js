var Graph = require("./Graph.js");
const path = require("path");
var DCGregex = /(?!\[)((\S+)\@([0-9]+\:[0-9]+\:[0-9]+\:[0-9]+))/gi;
var SCGregex = /(?!\[)((\S+)\@([0-9]+)\:([0-9]+\-[0-9]+))/gi;

const fs = require("fs");
var filenames = [];
var fileData = {};
var relevantfiles = [];
var appFiles = [];
var frmFiles = [];
var dynCallGraphEdit = new Graph();
var statCallGraphEdit = new Graph();
var statCallGraph = {};
var statCallGraph2 = {};
var fileIdentifier = "";
var fileParentDir = "";
var patternStore = {};
var EditMapping = {};

function main() {
  readJSFiles(inputDir);
  // Identyfing the root folder to express the paths
  fileIdentifier = path.basename(inputDir).split(path.sep).pop();
  fileParentDir = path.dirname(inputDir);
  // Formatting DCG json input
  var DCG = JSON.parse(fs.readFileSync(DCGFilename, "utf8"));
  var dynCallGraph = {};
  for (var key of Object.keys(DCG)) {
    new_key = formatDCG(key);
    if (!(new_key in dynCallGraph)) {
      dynCallGraph[new_key] = [];
    }
    values = DCG[key];
    for (var val of values) {
      new_val = formatDCG(val);
      if (!(new_val in dynCallGraph[new_key])) {
        dynCallGraph[new_key].push(new_val);
      }
    }
  }

  const json = JSON.stringify(dynCallGraph, null, 2);
  var filename = DCGFilename.replace(/.json$/, "_EDIT.json");
  fs.writeFileSync(filename, json, "utf8", function (err) {
    if (err) console.log("error", err);
  });
  // Converting json to graph
  dynCallGraphEdit = jsonToGraph(dynCallGraph);
  var SCG = JSON.parse(fs.readFileSync(SCGFilename, "utf8"));
  if (metricType == "Metric1" || metricType == "EdgeDiff") {
    //calling loc -> callee
    // Converting json to graph
    var SCG = JSON.parse(fs.readFileSync(SCGFilename, "utf8"));
    for (var mkey of Object.keys(SCG)) {
      if (typeof SCG[mkey] === "object") {
        for (var ckey in SCG[mkey]) {
          var new_key = formatSCG(ckey);
          if (new_key !== null) {
            if (!(new_key in statCallGraph)) {
              statCallGraph[new_key] = [];
            }
            values = SCG[mkey][ckey];
            for (var val of values) {
              var new_val = formatSCG(val);
              if (new_val !== null) {
                if (!(new_val in statCallGraph[new_key])) {
                  statCallGraph[new_key].push(new_val);
                }
              }
            }
          }
        }
      }
    }
    statCallGraphEdit = jsonToGraph(statCallGraph);
  } else if (metricType == "Metric2") {
    //enclosing body -> callee
    // Converting json to graph
    var SCG = JSON.parse(fs.readFileSync(SCGFilename, "utf8"));
    for (var mkey of Object.keys(SCG)) {
      if (typeof SCG[mkey] === "object" && formatSCG(mkey) !== null) {
        var new_key = formatSCG(mkey);
        if (!(new_key in statCallGraph)) {
          statCallGraph[new_key] = [];
        }
        for (const ckey in SCG[mkey]) {
          if (formatSCG(ckey) !== null) {
            values = SCG[mkey][ckey];
            for (var val of values) {
              if (formatSCG(val) !== null) {
                var new_val = formatSCG(val);
                if (!(new_val in statCallGraph[new_key])) {
                  statCallGraph[new_key].push(new_val);
                }
              }
            }
          }
        }
      }
    }
    statCallGraphEdit = jsonToGraph(statCallGraph);
  } else if (metricType == "Metric3") {
    //as it is
    // Converting json to graph
    var SCG = JSON.parse(fs.readFileSync(SCGFilename, "utf8"));
    for (var mkey of Object.keys(SCG)) {
      if (typeof SCG[mkey] === "object" && formatSCG(mkey) != null) {
        var new_mkey = formatSCG(mkey);
        if (!(new_mkey in statCallGraph)) {
          statCallGraph[new_mkey] = {};
        }
        for (const ckey in SCG[mkey]) {
          if (formatSCG(ckey) !== null) {
            var new_ckey = formatSCG(ckey);
            if (!(new_ckey in statCallGraph[new_mkey])) {
              statCallGraph[new_mkey][new_ckey] = [];
            }
            values = SCG[mkey][ckey];
            for (var val of values) {
              if (formatSCG(val) !== null) {
                var new_val = formatSCG(val);
                if (!(new_val in statCallGraph[new_mkey][new_ckey])) {
                  statCallGraph[new_mkey][new_ckey].push(new_val);
                }
              }
            }
          }
        }
      }
    }
    for (var mkey of Object.keys(SCG)) {
      //enclosing body -> callee
      if (typeof SCG[mkey] === "object" && formatSCG(mkey) != null) {
        var new_key = formatSCG(mkey);
        if (!(new_key in statCallGraph2)) {
          statCallGraph2[new_key] = [];
        }
        for (const ckey in SCG[mkey]) {
          if (formatSCG(ckey) !== null) {
            values = SCG[mkey][ckey];
            for (var val of values) {
              if (formatSCG(val) !== null) {
                var new_val = formatSCG(val);
                if (!(new_val in statCallGraph2[new_key])) {
                  statCallGraph2[new_key].push(new_val);
                }
              }
            }
          }
        }
      }
    }
    statCallGraphEdit = jsonToGraph(statCallGraph2);
  }
  /*for (var key of Object.keys(SCG)) {
    new_key = formatSCG(key);
    if (!(new_key in statCallGraph)) {
      statCallGraph[new_key] = [];
    }
    values = SCG[key];
    for (var val of values) {
      new_val = formatSCG(val);
      if (!(new_val in statCallGraph[new_key])) {
        statCallGraph[new_key].push(new_val);
      }
    }
  }
  statCallGraphEdit = jsonToGraph(statCallGraph);*/
  relevantfiles.forEach((v) => {
    if (!appFiles.includes(v)) {
      frmFiles.push(v);
    }
  });
}

function formatSCG(input) {
  // fomatting the line number according to the character spaces
  var SCG_pattern = SCGregex.exec(input);
  SCGregex.lastIndex = 0;

  if (SCG_pattern != null) {
    var fileName = SCG_pattern[2];
    var charSpaces = SCG_pattern[4];

    if (relevantfiles.includes(fileName)) {
      var inpJSFile = fileData[fileName];

      try {
        input = input.replace(
          SCG_pattern[1],
          fileName + "@" + lineSpaces(charSpaces, inpJSFile) + ":" + charSpaces
        );
      } catch (e) {
        console.log("SCG Formatting issues :" + input);
      }
    }
  }

  return input;
}
function formatDCG(input) {
  var unEditedInput = input;
  // Removing unnecessary information
  input = input.replace(/_orig_/g, "");
  // Replacing the Row-Column format to Character-Spaces format
  var DCG_pattern = DCGregex.exec(input);
  DCGregex.lastIndex = 0;
  if (DCG_pattern != null) {
    //the tmp folder contains the instrumented files,so we parse the local files
    var filePath = "";
    var evalString = "";
    var ifEval =
      DCG_pattern[2].startsWith("evalIndirect:") ||
      DCG_pattern[2].startsWith("eval:");
    if (ifEval) {
      evalString = DCG_pattern[2].split(":")[0] + ":";
      DCG_pattern[2] = DCG_pattern[2].split(":")[1];
    }
    if (path.dirname(DCG_pattern[2]).split(path.sep)[1] === "tmp") {
      var intpath = DCG_pattern[2].split(path.sep).slice(2).join(path.sep);
      var fileName = path.join(fileParentDir, intpath);
      filePath = fileName;
    } else {
      fileName = DCG_pattern[2];
      filePath = DCG_pattern[2];
    }
    var fileLoc = DCG_pattern[3];
    if (filenames.includes(fileName)) {
      relevantfiles.push(fileName);
      if (!fileData[fileName]) {
        fileData[fileName] = fs.readFileSync(filePath).toString().split("\n");
      }
      var inpJSFile = fileData[fileName];
      try {
        if (patternStore[DCG_pattern[1]]) {
          input = input.replace(DCG_pattern[1], patternStore[DCG_pattern[1]]);
        } else {
          patternStore[DCG_pattern[1]] =
            evalString +
            fileName +
            "@" +
            fileLoc.split(":")[0] +
            ":" +
            charSpaces(fileLoc, inpJSFile).join("-");
          input = input.replace(
            DCG_pattern[1],
            evalString +
              fileName +
              "@" +
              fileLoc.split(":")[0] +
              ":" +
              charSpaces(fileLoc, inpJSFile).join("-")
          );
        }
      } catch (e) {
        console.log("DCG Formatting issues :" + input);
      }
    }
  }
  if (!EditMapping[unEditedInput]) {
    EditMapping[unEditedInput] = input;
  }
  return input;
}

function rowSpaces(line, inpJSFile) {
  // Calculating the char spaces occupied by a line
  cnt = 0;
  for (var m = 0; m < line - 1; m++) {
    cnt += inpJSFile[m].length + 1;
  }
  return cnt;
}
function lineSpaces(chars, inpJSFile) {
  // Calculating the line given the char spaces

  var cnt = 0;
  startend = chars.split("-");
  for (var j = 0; j < inpJSFile.length; j++) {
    cnt += inpJSFile[j].length + 1;
    if (startend[0] < cnt) {
      return j + 1;
    }
  }
  return j;
}
function charSpaces(lineInfo, inpJSFile) {
  // Converting the row column to char spaces
  arr = [];
  rowcol = lineInfo.split(":");
  for (k = 0; k < rowcol.length; k += 2) {
    arr.push(
      rowSpaces(parseInt(rowcol[k]), inpJSFile) + parseInt(rowcol[k + 1]) - 1
    );
  }
  return arr;
}

function jsonToGraph(input) {
  // Converting a json input to Graph
  output = new Graph();
  for (var idx in input) {
    var item = input[idx];
    for (var key in item) {
      output.addEdge(idx, item[key]);
    }
  }
  return output;
}
function readJSFiles(dir) {
  // Reading the javascript files to format the dynamic callgraph

  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      readJSFiles(dirPath);
    } else {
      if (f.endsWith(".js")) {
        var filePath = path.join(dir, f);
        filenames.push(filePath);
      }
    }
  });
}

function processInputs(DCG, SCG, JSfiles, metric) {
  // Getting the inputs from console
  DCGFilename = DCG;
  SCGFilename = SCG;
  inputDir = JSfiles;
  metricType = metric;
  main();
  if (metricType == "Metric3") {
    return [dynCallGraphEdit, statCallGraphEdit, statCallGraph];
  } else {
    //optimize this later
    for (var key of Object.keys(patternStore)) {
      patternStore[key.replace(".js", "_orig_.js")] = patternStore[key];
      delete patternStore[key];
    }
    return [dynCallGraphEdit, statCallGraphEdit, patternStore, EditMapping];
  }
}
module.exports = {
  processInputs,
};

/*
node experiments/metrics/preprocess.js 
*/
