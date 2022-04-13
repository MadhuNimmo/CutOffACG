const fs = require("fs");
const deepDiff = require("deep-object-diff");
DCGFilename = process.argv[2];
DCGFilename2 = process.argv[3];
var DCG = JSON.parse(fs.readFileSync(DCGFilename, "utf8"));
var DCG2 = JSON.parse(fs.readFileSync(DCGFilename2, "utf8"));
console.log(deepDiff.detailedDiff(DCG, DCG2));
