const fs = require("fs");
const deepDiff = require("deep-object-diff");
DCGFilename = process.argv[2];
DCGFilename2 = process.argv[3];
var DCG = JSON.parse(fs.readFileSync(DCGFilename, "utf8"));
var DCG2 = JSON.parse(fs.readFileSync(DCGFilename2, "utf8"));
var diff = deepDiff.detailedDiff(DCG, DCG2);
console.log(diff)
for (const key in diff){
        if (key == "deleted"){
                for(var val in diff[key]){
                        console.log(key+" => "+val)
                }
        }
}