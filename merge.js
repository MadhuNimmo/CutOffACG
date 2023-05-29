const fs = require("fs");
const path = require("path");
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function getSize(obj) {
  var cnt = 0;
  for (var key in obj) {
    var ckeys = obj[key];
    for (var ckey in ckeys) {
      cnt += obj[key][ckey].length;
    }
  }
  return cnt;
}
//var appSCG = process.argv[2];
//var frmSCG = process.argv[3];
//var appSCGgrph = JSON.parse(fs.readFileSync(appSCG, "utf8"));
//var frmSCGgprh = JSON.parse(fs.readFileSync(frmSCG, "utf8"));
//var finalSCGgrph = {"a":{"finalSCGgrph":["b1","b2"],"prcsngGrph":["c1"]},"b":{"b1":["c1"]}}
//var prcsngGrph = {"z":{"z1":["y1","y2"]},"a":{"finalSCGgrph":["b1","b2"],"prcsngGrph":["c2"],"a3":["c4"]}}
var finalSCGgrph = {};
var prcsngNum = 2;
while (prcsngNum < process.argv.length) {
  var prcsngGrph = JSON.parse(fs.readFileSync(process.argv[prcsngNum], "utf8"));
  console.log("Processing graph of size:" + getSize(prcsngGrph));
  if (isEmpty(finalSCGgrph)) {
    finalSCGgrph = prcsngGrph;
  } else {
    for (var key in prcsngGrph) {
      if (key in finalSCGgrph) {
        var childkeys = prcsngGrph[key];
        for (var ckey in childkeys) {
          if (ckey in finalSCGgrph[key]) {
            var values = prcsngGrph[key][ckey];
            for (var val of values) {
              if (!finalSCGgrph[key][ckey].includes(val)) {
                finalSCGgrph[key][ckey].push(val);
              }
            }
          } else {
            finalSCGgrph[key][ckey] = prcsngGrph[key][ckey];
          }
        }
      } else {
        finalSCGgrph[key] = prcsngGrph[key];
      }
    }
  }
  prcsngNum++;
}
console.log("Final graph size:" + getSize(finalSCGgrph));
fs.writeFileSync(
  path.dirname(process.argv[2]) + "/MergedSCG.json",
  JSON.stringify(finalSCGgrph, null, 2),
  "utf8",
  function (err) {
    if (err) console.log("error", err);
  }
);
console.log(
  getSize(
    JSON.parse(
      fs.readFileSync(
        "/Users/madhurimachakraborty/Documents/LosslessExp/todo_react/SCG_OPT.json",
        "utf8"
      )
    )
  )
);
/*(var key in prcsngGrph){
        if(key in finalSCGgrph){
                var childkeys = prcsngGrph[key]
                for(var ckey in childkeys){
                        if(ckey in finalSCGgrph[key]){
                                var values = prcsngGrph[key][ckey]
                                for(var val of values){
                                        if(!(finalSCGgrph[key][ckey].includes(val))){
                                                finalSCGgrph[key][ckey].push(val)
                                        }
                                }
                        }else{
                                finalSCGgrph[key][ckey]= prcsngGrph[key][ckey]
                        }
                }
        }else{
                finalSCGgrph[key]=prcsngGrph[key]
        }
}
console.log(finalSCGgrph)
var cnt=0
for(var key in finalSCGgrph){
        var ckeys = finalSCGgrph[key]
        for(var ckey in ckeys){
                cnt+=finalSCGgrph[key][ckey].length
        }
}
console.log(cnt)*/
