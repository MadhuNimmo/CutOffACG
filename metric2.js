var Graph = require("./Graph.js");
var { processInputs } = require("./preprocess.js");
const path = require("path");
const fs = require("fs");
var frmFiles = [];
var DCG = new Graph();
var SCG = new Graph();

function main() {
  [DCG, SCG] = processInputs(DCGFilename, SCGFilename, inputDir, "Metric2");
  appFiles = appfrmfiles[name]["app"];
  frmFiles = appfrmfiles[name]["frm"];

  console.log(DCG.getSize(), SCG.getSize());

  return getTypeMetric();
}

function getStaticCallGraphNodes(input_keys) {
  //Identifying the reachable nodes through BFS given a starting node
  item_keys = [...SCG.getKeys()];

  var output = [];
  var flag = true;
  for (input_key of input_keys) {
    flag = true;
    for (item_key of item_keys) {
      if (item_key == input_key || item_key.includes(input_key)) {
        flag = false;
        var bfs_items = SCG.getBFS(item_key);
        for (bfsitem of bfs_items) {
          if (!output.includes(bfsitem)) {
            output.push(bfsitem);
          }
        }
      }
    }
    if (flag == true) {
      output.push(input_key);
    }
  }

  return output;
}
function nodeType(input) {
  var type = "";
  if (
    appFiles.some(function (v) {
      return input.indexOf(v) >= 0;
    })
  ) {
    type = "app";
  } else if (
    frmFiles.some(function (v) {
      return input.indexOf(v) >= 0;
    })
  ) {
    type = "frm";
  } else {
    type = "none";
  }
  return type;
}
function comReach(list1, list2) {
  output = [];
  for (item1 of list1) {
    for (item2 of list2) {
      if (item1 == item2 || item2.includes(item1)) {
        if (!output.includes(item1)) {
          output.push(item1);
        }
      }
    }
  }
  return output;
}
function getTypeMetric() {
  //Calculating the precision and recall based on the node reachability of the entry points
  var tot_precision = 0;
  var tot_recall = 0;
  var app_precision = 0;
  var app_recall = 0;
  var frm_precision = 0;
  var frm_recall = 0;

  var DCG_appnodes = [];
  var DCG_frmnodes = [];
  var SCG_appnodes = [];
  var SCG_frmnodes = [];
  var COM_appnodes = [];
  var COM_frmnodes = [];
  if (DCG.getValues("system (Native)") == undefined) {
    console.log("No entry Point Node found");
    process.exit(1);
  }
  keys = [...DCG.getValues("system (Native)")];
  var DCG_nodes = DCG.getAllChildNodes();
  var SCG_nodes = getStaticCallGraphNodes(keys);

  var COM_nodes = comReach(DCG_nodes, SCG_nodes);

  console.log(DCG_nodes.length, SCG_nodes.length, COM_nodes.length);

  tot_precision = (
    COM_nodes.length == 0 ? 0 : COM_nodes.length / SCG_nodes.length
  ).toFixed(4);
  tot_recall = (
    COM_nodes.length == 0 ? 0 : COM_nodes.length / DCG_nodes.length
  ).toFixed(4);

  for (var DCG_node of DCG_nodes) {
    if (nodeType(DCG_node) == "app") {
      DCG_appnodes.push(DCG_node);
    } else if (nodeType(DCG_node) == "frm") {
      DCG_frmnodes.push(DCG_node);
    }
  }

  for (var SCG_node of SCG_nodes) {
    if (nodeType(SCG_node) == "app") {
      SCG_appnodes.push(SCG_node);
    } else if (nodeType(SCG_node) == "frm") {
      SCG_frmnodes.push(SCG_node);
    }
  }

  COM_appnodes = comReach(DCG_appnodes, SCG_appnodes);
  COM_frmnodes = comReach(DCG_frmnodes, SCG_frmnodes);

  console.log(DCG_appnodes.length, SCG_appnodes.length, COM_appnodes.length);
  console.log(DCG_frmnodes.length, SCG_frmnodes.length, COM_frmnodes.length);

  app_precision = (
    COM_appnodes.length == 0 ? 0 : COM_appnodes.length / SCG_appnodes.length
  ).toFixed(4);
  app_recall = (
    COM_appnodes.length == 0 ? 0 : COM_appnodes.length / DCG_appnodes.length
  ).toFixed(4);

  frm_precision = (
    COM_frmnodes.length == 0 ? 0 : COM_frmnodes.length / SCG_frmnodes.length
  ).toFixed(4);
  frm_recall = (
    COM_frmnodes.length == 0 ? 0 : COM_frmnodes.length / DCG_frmnodes.length
  ).toFixed(4);
  console.log("Metric 2:");
  console.log(
    "total",
    " - ",
    "precision : ",
    tot_precision,
    "recall : ",
    tot_recall
  );
  console.log(
    "application",
    " - ",
    "precision : ",
    app_precision,
    "recall : ",
    app_recall
  );
  console.log(
    "framework",
    " - ",
    "precision : ",
    frm_precision,
    "recall : ",
    frm_recall
  );
  return {
    "total DCG nodes": DCG_nodes.length,
    "total SCG nodes": SCG_nodes.length,
    "total Common nodes": COM_nodes.length,
    "application DCG nodes": DCG_appnodes.length,
    "application SCG nodes": SCG_appnodes.length,
    "application Common nodes": COM_appnodes.length,
    "framework DCG nodes": DCG_frmnodes.length,
    "framework SCG nodes": SCG_frmnodes.length,
    "framework Common nodes": COM_frmnodes.length,
    "total avg precision": tot_precision,
    "total avg recall": tot_recall,
    "application precision": app_precision,
    "application recall": app_recall,
    "framework precision": frm_precision,
    "framework recall": frm_recall,
  };
}

function getInputs() {
  // Getting the inputs from console
  if (process.argv.length == 7) {
    DCGFilename = process.argv[2];
    SCGFilename = process.argv[3];
    inputDir = process.argv[4].toString();
    appfrmfiles = JSON.parse(fs.readFileSync(process.argv[5], "utf8"));
    name = process.argv[6];
    var metout = main();
    const json = JSON.stringify(metout, null, 2);
    filename = process.argv[3].replace(/SCG/, "Metrics2");
    fs.writeFileSync(filename, json, "utf8", function (err) {
      if (err) console.log("error", err);
    });
  } else {
    console.log(
      "Please enter arguments in the following sequence:\n1:Dynamic Call graph File\n2:Static Call Graph File\n3:Directory of Javascript files\n4:Output Directory"
    );
  }
}

getInputs();

/*function metric2(DCGinp,SCGinp,inpDir,appFrm) {
        DCGFilename = DCGinp
        SCGFilename = SCGinp
        inputDir = inpDir
        appfrmfiles = appFrm
        main();
        return;
}
module.exports={
        metric2
}
*/
/*
node metrics/metric2.js absolute-path-to-DCG absolute-path-to-SCG absolute-path-to-dir-to-be-analysed path-to-analysis_results.json ToDoMVC-framework-name
*/
