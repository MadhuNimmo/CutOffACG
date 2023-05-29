//Prunes SCG based on if a call Site of the format PrimitiveObject.method() ends up calling non-native methods
const fs = require('fs');
const path = require('path');

const folderPath = '/Users/madhurimachakraborty/Documents/todomvc-master/examples/jquery/'; // Replace with your folder path

const SCG = JSON.parse(fs.readFileSync('/Users/madhurimachakraborty/Documents/PrecMetrics/todo_jquery/FSSCGImp_BND2.json', "utf8"));

var primitives = ["Object", "Function", "Array", "StringObject", "NumberObject", "BooleanObject", "RegExp"]

var fileData = new Map();

function readFilesRecursively(dir, fileData ) {
        const files = fs.readdirSync(dir);
      
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
      
          if (stat.isDirectory()) {
            readFilesRecursively(filePath, fileData);
          } else {
                if(filePath.endsWith(".js")){
                        const data = fs.readFileSync(filePath, 'utf8');
                        fileData.set(filePath, data);
                }
            
          }
        });
      }

function pruneSCG(SCG){
        var prunedSCG = {}
        for (var key in SCG) {
                var childkeys = SCG[key];
                for (var ckey in childkeys) {
                        var values = SCG[key][ckey];
                        if (!(key in prunedSCG)){
                                prunedSCG[key]={}
                        }
                        if (!(ckey in prunedSCG[key])){
                                prunedSCG[key][ckey]=[]
                        }
                        if(!ckey.includes("Native")){
                                fileName = ckey.split("@")[0]
                                lineandChars = ckey.split("@")[1]
                                lineNum = lineandChars.split(":")[0]
                                chars = lineandChars.split(":")[1]
                                charsStart = chars.split("-")[0]
                                charsEnd = chars.split("-")[1]
                        }
                        if(!ckey.includes("Native") && ifCodeStartsWithPrimitives(fileName,charsStart,charsEnd)){
                                for (var val of values) {
                                        if(val.includes("Native")){
                                                prunedSCG[key][ckey].push(val)
                                        }
                                }
                               
                        }else{
                                for (var val of values) {
                                        prunedSCG[key][ckey].push(val)
                                }
                        }
                       
                }
        }
        //console.log(prunedCSG)
        return prunedSCG
}

function ifCodeStartsWithPrimitives(filename,charStartPos,charEndPos){
        if(fileData.has(filename)){
                var codeString = (fileData.get(filename)).substring(charStartPos,charEndPos)
                return primitives.some((element) => codeString.startsWith(element))
        }
        return false
}

function main(){
        readFilesRecursively(folderPath,fileData);
        var prunedSCG = pruneSCG(SCG);
        fs.writeFileSync(
                path.dirname('/Users/madhurimachakraborty/Documents/PrecMetrics/todo_jquery/FSSCGImp_BND2.json') + "/PrunedSCGImp_BND2.json",
                JSON.stringify(prunedSCG, null, 2),
                "utf8",
                function (err) {
                  if (err) console.log("error", err);
                }
        );
}
main();