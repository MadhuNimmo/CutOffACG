// Finds how many calls have been made from a file to any other file (excludes itself)

const fs = require('fs');
const path = require('path');


var trace = {}

var tracedata = []

var propdata = []


function analyzeDCG(trace){
        for (var key in trace) {
                indTrace = trace[key]['trace']
                if(indTrace.length!=1 && typeof indTrace[0] != 'string' ){
                        tracedata.push(indTrace.length)
                }
        }
        return tracedata
}

function analyzeDCGProps(trace){
        for (var key in trace) {
                indTrace = trace[key]['trace']
                if(indTrace.length!=1 && typeof indTrace[0] != 'string' ){
                        propdata.push(indTrace.filter(el => el.typ=="Get").length)
                }
        }
        return propdata
}

function computeMetrics(data){
         // Mean
         const mean = data.reduce((acc, curr) => acc + curr, 0) / data.length;
         console.log(`Mean: ${mean}`);
 
         // Median
         const sortedArr = data.sort((a, b) => a - b);
         const mid = Math.floor(sortedArr.length / 2);
         const median = sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
         console.log(`Median: ${median}`);
 
         // Mode
         const modeObj = {};
         data.forEach((num) => {
         if (!modeObj[num]) modeObj[num] = 0;
         modeObj[num]++;
         });
 
         let modes = [];
         let max = 0;
         for (const num in modeObj) {
         if (modeObj[num] > max) {
         modes = [num];
         max = modeObj[num];
         } else if (modeObj[num] === max) {
         modes.push(num);
         }
         }
 
         console.log(`Mode: ${modes.join(", ")}`);
 
         const frequencyDist = data.reduce((freqDist, num) => {
                 if (!freqDist[num]) freqDist[num] = 0;
                 freqDist[num]++;
                 return freqDist;
               }, {});
               
         console.log(frequencyDist);
}

function main(){
        if (process.argv.length == 3 ) {

                trace = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
                analyzeDCG(trace)
                computeMetrics(tracedata)
                analyzeDCGProps(trace)
                computeMetrics(propdata)

        }
        
}

main();