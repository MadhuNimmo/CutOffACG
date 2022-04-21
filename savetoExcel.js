const xlsx = require("xlsx"); //npm install xlsx
const fs = require("fs"); //npm install fs
//var rawFile = fs.readFileSync("./datas.json"); //dir of your json file as param
//var raw = JSON.parse(rawFile);
const path = require("path");
var regex = /todo_([a-z]*)Metrics3_([0-9]*)/gi;
var rawData = {};

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (
      file != "Previous results" &&
      fs.statSync(dirPath + "/" + file).isDirectory()
    ) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.includes("Metrics3")) {
        let filePath = path.join(dirPath, "/", file);
        arrayOfFiles.push(filePath);
        var fileData = readJSON(filePath);
        if (!(fileData[0] in rawData)) {
          rawData[fileData[0]] = [];
        }
        rawData[fileData[0]].push({
          IterationNumber: fileData[1],
          Precision: fileData[2],
          Recall: fileData[3],
        });
      }
    }
  });

  return arrayOfFiles;
};

const readJSON = function (file) {
  let rawdata = fs.readFileSync(file);
  let jsondata = JSON.parse(rawdata);
  let details = file.split("/").slice(-1)[0];
  let bnchmrk = regex.exec(details)[1];
  regex.lastIndex = 0;
  let iter = regex.exec(details)[2];
  regex.lastIndex = 0;
  return [
    bnchmrk,
    iter,
    jsondata["total avg precision"],
    jsondata["total avg recall"],
  ];
};
var listFiles = getAllFiles("/Users/madhurimachakraborty/Documents/CutOffExp/");
//console.log(rawData);

var raw = [];
//var files = [];
for (each in rawData) {
  for (eachIter in rawData[each]) {
    raw.push({
      Benchmark: each,
      IterationNumber: rawData[each][eachIter]["IterationNumber"],
      Precision: rawData[each][eachIter]["Precision"],
      Recall: rawData[each][eachIter]["Recall"],
    });
  }
}
/*var obj = files.map((e) => {
  return e;
});*/
//console.log(raw);
var newWB = xlsx.utils.book_new();

var newWS = xlsx.utils.json_to_sheet(raw);

xlsx.utils.book_append_sheet(newWB, newWS, "name"); //workbook name as param

xlsx.writeFile(newWB, "MetricsData.xlsx"); //file name as param*/
