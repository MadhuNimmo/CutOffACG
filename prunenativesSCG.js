//Prunes SCG based on if a call Site of the format PrimitiveObject.method() ends up calling non-native methods
const fs = require('fs');
const path = require('path');

var SCG = {}

function pruneSCG(SCG){
        var prunedSCG = {}
        for (var key in SCG) {
                var childkeys = SCG[key];
                var mod_key;
                if(childkeys.length==0){
                        if(key.includes("(Native)")){
                                if (key.includes("_")){
                                        mod_key = key.slice(key.lastIndexOf("_") + 1)
                                }else{
                                        mod_key = key
                                }
                                prunedSCG[mod_key]={}
                        }else if (!(key in prunedSCG)){
                                prunedSCG[key]={}
                        }
                        key = mod_key || key
                }
                for (var ckey in childkeys) {
                        var values = SCG[key][ckey];
                        var unmod_key = key;
                        if(key.endsWith("(Native)")){
                                if (key.includes("_")){
                                        key = key.slice(key.lastIndexOf("_") + 1)
                                }else{
                                        key = key
                                }
                                prunedSCG[key]={}
                        }else if (!(key in prunedSCG)){
                                prunedSCG[key]={}
                        }
                        //key = mod_key || key
                        if(ckey.endsWith("(Native)")){
                                if (ckey.includes("_")){
                                        ckey = ckey.slice(ckey.lastIndexOf("_") + 1)
                                }else{
                                        ckey = ckey
                                }
                                prunedSCG[key][ckey]=[]
                                //ckey=mod_ckey
                        }
                        else if (!(ckey in prunedSCG[key])){
                                prunedSCG[key][ckey]=[]
                        }
                        /*if(!ckey.includes("Native")){
                                fileName = ckey.split("@")[0]
                                lineandChars = ckey.split("@")[1]
                                lineNum = lineandChars.split(":")[0]
                                chars = lineandChars.split(":")[1]
                                charsStart = chars.split("-")[0]
                                charsEnd = chars.split("-")[1]
                        }*/
                        var nativeValues = moreThanOneCalleeIsNative(values)
                        if(nativeValues.length>1){
                                        var [allCallsAreToSameProp, propName] = callsToSameProperty(nativeValues)
                                        //console.log(allCallsAreToSameProp,propName)
                                        if(allCallsAreToSameProp){
                                                prunedSCG[key][ckey].push(propName)
                                                for (var val of values){
                                                        if(!nativeValues.includes(val)){
                                                                prunedSCG[key][ckey].push(val)
                                                        }
                                                }
                                        }else{
                                                for (var val of values) {
                                                        if(val.endsWith("(Native)")){
                                                                if (val.includes("_")){
                                                                        val = val.slice(val.lastIndexOf("_") + 1)
                                                                }else{
                                                                        val = val
                                                                }
                                                                prunedSCG[key][ckey].push(val)
                                                        }else{
                                                                prunedSCG[key][ckey].push(val)
                                                        }
                                                }
                                        }
                        }else{
                                for (var val of values) {
                                
                                        if(val.endsWith("(Native)")){
                                                if (val.includes("_")){
                                                        val = val.slice(val.lastIndexOf("_") + 1)
                                                }else{
                                                        val = val
                                                }
                                                prunedSCG[key][ckey].push(val)
                                        }else{
                                                prunedSCG[key][ckey].push(val)
                                        }
                                }
                        }
                       
                }
        }
        //console.log(prunedSCG)
        return prunedSCG
}

function moreThanOneCalleeIsNative(arr){
        const filtered = arr.filter(str => str.includes('(Native)'));
        return filtered;
}


function callsToSameProperty(arr){
        var common =""
        if (arr[0].includes("_")){
                common = arr[0].slice(arr[0].lastIndexOf("_") + 1)
        }else{
                common = arr[0]
        }
        //console.log(arr,common)
        return [arr.every(elem => elem.includes(common)),common];
}

function main(){
        if (process.argv.length == 3 ) {

                SCG = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

                var prunedSCG = pruneSCG(SCG);

                fs.writeFileSync(
                        path.dirname(process.argv[2]) + "/PrunedFSSCGImp2_BND2.json",
                        JSON.stringify(prunedSCG, null, 2),
                        "utf8",
                        function (err) {
                        if (err) console.log("error", err);
                        }
                );
        }
}
main();