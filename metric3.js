var Graph = require("./Graph.js");
var { processInputs } = require("./preprocess.js");
const path = require("path");
const fs = require("fs");
var frmFiles = [];
var DCG = new Graph();
var SCG = new Graph();

function main() {
  [DCG, SCG, SCGobj] = processInputs(
    DCGFilename,
    SCGFilename,
    inputDir,
    "Metric3"
  );
  appFiles = appfrmfiles[name]["app"];
  frmFiles = appfrmfiles[name]["frm"];

  return getTypeMetric();
}

function getStaticCallGraphEdges(input_keys) {
  item_keys = [...SCG.getKeys()];
  var output = [];
  var outGraph = new Graph();
  for (input_key of input_keys) {
    for (item_key of item_keys) {
      if (item_key == input_key || item_key.includes(input_key)) {
        var bfs_items = SCG.getBFS(item_key);
        for (bfsitem of bfs_items) {
          if (!output.includes(bfsitem)) {
            output.push(bfsitem);
          }
        }
      }
    }
  }

  for (var out_node of output) {
    for (var key of Object.keys(SCGobj)) {
      if (out_node === key) {
        for (const prop in SCGobj[key]) {
          var values = SCGobj[key][prop];
          for (var val of values) {
            outGraph.addEdge(prop, val);
          }
        }
      }
    }
  }
  return outGraph;
}
function comReach(graph1, graph2) {
  output = new Graph();
  for (key1 of graph1.getKeys()) {
    for (key2 of graph2.getKeys()) {
      if (key1 == key2 || key2.includes(key1)) {
        for (val1 of graph1.getValues(key1)) {
          for (val2 of graph2.getValues(key2)) {
            if (val1 == val2 || val2.includes(val1)) {
              if (!output.hasEdge(key1, val1)) {
                output.addEdge(key1, val1);
                //new
                break;
              }
            }
          }
        }
      }
    }
  }
  return output;
}
function getTypeMetric() {
  var tot_precision = 0;
  var tot_recall = 0;
  var app_precision = 0;
  var app_recall = 0;
  var frm_precision = 0;
  var frm_recall = 0;
  var int_precision = 0;
  var int_recall = 0;

  var DCG_appedges = new Graph();
  var SCG_appedges = new Graph();
  var DCG_frmedges = new Graph();
  var SCG_frmedges = new Graph();
  var DCG_intedges = new Graph();
  var SCG_intedges = new Graph();

  if (DCG.getValues("system (Native)") == undefined) {
    console.log("No entry Point Node found");
    process.exit(1);
  }

  keys = [...DCG.getValues("system (Native)")];

  var DCG_edges = DCG.getAllEdges();
  var SCG_edges = getStaticCallGraphEdges(keys);
  var COM_edges = comReach(DCG_edges, SCG_edges);

  console.log(DCG_edges.getSize(), SCG_edges.getSize(), COM_edges.getSize());

  var DCG_classedges = getEdgeTypes(DCG_edges, "DCG");

  DCG_appedges = DCG_classedges["Application"];
  DCG_intedges = DCG_classedges["Intermediate"];
  DCG_frmedges = DCG_classedges["Framework"];

  var SCG_classedges = getEdgeTypes(SCG_edges, "SCG");

  SCG_appedges = SCG_classedges["Application"];
  SCG_intedges = SCG_classedges["Intermediate"];
  SCG_frmedges = SCG_classedges["Framework"];

  tot_precision = (
    COM_edges.getSize() == 0 ? 0 : COM_edges.getSize() / SCG_edges.getSize()
  ).toFixed(4);
  tot_recall = (
    COM_edges.getSize() == 0 ? 0 : COM_edges.getSize() / DCG_edges.getSize()
  ).toFixed(4);

  COM_appedges = comReach(DCG_appedges, SCG_appedges);
  COM_intedges = comReach(DCG_intedges, SCG_intedges);
  COM_frmedges = comReach(DCG_frmedges, SCG_frmedges);

  console.log(
    DCG_appedges.getSize(),
    SCG_appedges.getSize(),
    COM_appedges.getSize()
  );
  console.log(
    DCG_frmedges.getSize(),
    SCG_frmedges.getSize(),
    COM_frmedges.getSize()
  );
  console.log(
    DCG_intedges.getSize(),
    SCG_intedges.getSize(),
    COM_intedges.getSize()
  );

  app_precision = (
    COM_appedges.getSize() == 0
      ? 0
      : COM_appedges.getSize() / SCG_appedges.getSize()
  ).toFixed(4);
  app_recall = (
    COM_appedges.getSize() == 0
      ? 0
      : COM_appedges.getSize() / DCG_appedges.getSize()
  ).toFixed(4);

  int_precision = (
    COM_intedges.getSize() == 0
      ? 0
      : COM_intedges.getSize() / SCG_intedges.getSize()
  ).toFixed(4);
  int_recall = (
    COM_intedges.getSize() == 0
      ? 0
      : COM_intedges.getSize() / DCG_intedges.getSize()
  ).toFixed(4);

  frm_precision = (
    COM_frmedges.getSize() == 0
      ? 0
      : COM_frmedges.getSize() / SCG_frmedges.getSize()
  ).toFixed(4);
  frm_recall = (
    COM_frmedges.getSize() == 0
      ? 0
      : COM_frmedges.getSize() / DCG_frmedges.getSize()
  ).toFixed(4);
  console.log("Metric 3:");
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
  console.log(
    "intermediate",
    " - ",
    "precision : ",
    int_precision,
    "recall : ",
    int_recall
  );

  return {
    "total DCG edges": DCG_edges.getSize(),
    "total SCG edges": SCG_edges.getSize(),
    "total Common edges": COM_edges.getSize(),
    "application DCG edges": DCG_appedges.getSize(),
    "application SCG edges": SCG_appedges.getSize(),
    "application Common edges": COM_appedges.getSize(),
    "framework DCG edges": DCG_frmedges.getSize(),
    "framework SCG edges": SCG_frmedges.getSize(),
    "framework Common edges": COM_frmedges.getSize(),
    "intermediate DCG edges": DCG_intedges.getSize(),
    "intermediate SCG edges": SCG_intedges.getSize(),
    "intermediate Common edges": COM_intedges.getSize(),
    "total avg precision": tot_precision,
    "total avg recall": tot_recall,
    "application precision": app_precision,
    "application recall": app_recall,
    "framework precision": frm_precision,
    "framework recall": frm_recall,
    "intermediate precision": int_precision,
    "intermediate recall": int_recall,
  };
}
function getEdgeTypes(input, name) {
  var cnt = 0;
  keys = [...input.getKeys()];
  var app_output = new Graph();
  var frm_output = new Graph();
  var int_output = new Graph();
  for (var key of keys) {
    var values = input.getValues(key);
    for (value of values) {
      if (
        appFiles.some(function (v) {
          return key.indexOf(v) >= 0;
        })
      ) {
        if (
          appFiles.some(function (v) {
            return value.indexOf(v) >= 0;
          }) ||
          value.indexOf("(Native)") >= 0
        ) {
          if (!app_output.hasEdge(key, value)) {
            app_output.addEdge(key, value);
          }
        } else if (
          frmFiles.some(function (v) {
            return value.indexOf(v) >= 0;
          })
        ) {
          if (!int_output.hasEdge(key, value)) {
            int_output.addEdge(key, value);
          }
        }
      } else if (
        frmFiles.some(function (v) {
          return key.indexOf(v) >= 0;
        })
      ) {
        if (
          appFiles.some(function (v) {
            return value.indexOf(v) >= 0;
          })
        ) {
          if (!int_output.hasEdge(key, value)) {
            int_output.addEdge(key, value);
          }
        } else if (
          frmFiles.some(function (v) {
            return value.indexOf(v) >= 0;
          }) ||
          value.indexOf("(Native)") >= 0
        ) {
          if (!frm_output.hasEdge(key, value)) {
            frm_output.addEdge(key, value);
          }
        }
      } else if (key.indexOf("(Native)") >= 0) {
        if (
          appFiles.some(function (v) {
            return value.indexOf(v) >= 0;
          })
        ) {
          if (!app_output.hasEdge(key, value)) {
            app_output.addEdge(key, value);
          }
        } else if (
          frmFiles.some(function (v) {
            return value.indexOf(v) >= 0;
          })
        ) {
          if (!frm_output.hasEdge(key, value)) {
            frm_output.addEdge(key, value);
          }
        } else {
          cnt += 1;
        }
      } else {
        //console.log(key,value,name)
      }
    }
  }
  console.log(
    name,
    app_output.getSize(),
    int_output.getSize(),
    frm_output.getSize(),
    cnt
  );
  return {
    Application: app_output,
    Intermediate: int_output,
    Framework: frm_output,
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
    filename = process.argv[3].replace(/SCG/, "Metrics3");
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

/*function metric3(DCGinp,SCGinp,inpDir,appFrm) {
        DCGFilename = DCGinp
        SCGFilename = SCGinp
        inputDir = inpDir
        appfrmfiles = appFrm
        main();
        return;
}
module.exports={
        metric3
}
*/
/*
node metrics/metric3.js absolute-path-to-DCG absolute-path-to-SCG absolute-path-to-dir-to-be-analysed path-to-analysis_results.json ToDoMVC-framework-name
*/
