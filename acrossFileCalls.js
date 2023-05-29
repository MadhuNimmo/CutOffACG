// Finds how many calls have been made from a file to any other file (excludes itself)

const fs = require('fs');
const path = require('path');


var DCG = {}

var fileType = {}

var benchmark = '';

var fileData = {}
var fileTypeData = {}
var frmwrkData = {}


function analyzeDCG(DCG){
        for (var key in DCG) {
                if(!key.includes("Native")){
                        if(key.startsWith("eval")){
                                key_fileName = (key.split(":")[1]).split("@")[0]
                        }else{
                                key_fileName = key.split("@")[0]
                        }
                        if (!(key_fileName in fileData)){
                                fileData[key_fileName]={}
                        }
                                var values = DCG[key]
                                for (var val of values) {
                                        if(!val.includes("Native")){
                                                if(val.startsWith("eval")){
                                                        val_fileName = (val.split(":")[1]).split("@")[0]
                                                }else{
                                                        val_fileName = val.split("@")[0]
                                                }
                                                if (!(val_fileName in fileData[key_fileName])){
                                                        fileData[key_fileName][val_fileName]=0
                                                }
                                                fileData[key_fileName][val_fileName]+=1
                                        }
                                }
                }
        }
        console.log(fileData)
}

function analyzefileType(fileData){
        for(key in fileData){
                var values = fileData[key];
                var type;
                if(!(key in fileTypeData)){
                        if (fileType[benchmark]['app'].includes(key)){
                                type= 'app'
                        }else if (fileType[benchmark]['frm'].includes(key)){
                                type= 'frm'
                        }
                        fileTypeData[key]={'type': type, 'app': 0, 'frm': 0}
                }
                for (val in values){
                        if(val!==key){
                                if(fileType[benchmark]['app'].includes(val)){
                                        fileTypeData[key]['app']+=fileData[key][val]
                                }else if(fileType[benchmark]['frm'].includes(val)) {
                                        fileTypeData[key]['frm']+=fileData[key][val]
                                }
                        }
                }
               
        }
        console.log(fileTypeData);
}

function callTypes(fileTypeData){
        frmwrkData = {'appToApp':0,'appToFrm':0,'frmToApp':0,'frmToFrm':0,}
        for(key in fileTypeData){
                if(fileTypeData[key]['type']=='app' ){
                        if(fileTypeData[key]['frm']){
                                frmwrkData['appToFrm']+=fileTypeData[key]['frm'];
                        }else if(fileTypeData[key]['app']){
                                frmwrkData['appToApp']+=fileTypeData[key]['app'];
                        }
                }else if(fileTypeData[key]['type']=='frm' ){
                        if(fileTypeData[key]['frm']){
                                frmwrkData['frmToFrm']+=fileTypeData[key]['frm'];
                        }else if(fileTypeData[key]['app']){
                                frmwrkData['frmToApp']+=fileTypeData[key]['app'];
                        }
                }
        }
               
        console.log(frmwrkData);
}

function main(){
        if (process.argv.length == 5 ) {

                DCG = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
                fileType = JSON.parse(fs.readFileSync(process.argv[3],"utf8"));
                benchmark = process.argv[4].toString();

                analyzeDCG(DCG)

                analyzefileType(fileData)
        
                callTypes(fileTypeData)
        }
        
}

main();
