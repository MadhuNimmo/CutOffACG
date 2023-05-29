// Finds how many calls have been made from a file to any other file (excludes itself)

const fs = require('fs');
const path = require('path');


var SCG = {}

var fileType = {}

var benchmark = '';

var prunedSCG = {}

var dependencies = {
        "canjs": ["/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/node_modules/canjs/can.jquery.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/node_modules/canjs-localstorage/can.localstorage.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/node_modules/jquery/dist/jquery.js"],
        "knockback": [
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/knockback/node_modules/backbone/backbone.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/knockback/node_modules/backbone.localstorage/backbone.localStorage.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/knockback/node_modules/jquery/dist/jquery.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/knockback/node_modules/knockback/knockback.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/knockback/node_modules/knockout/build/output/knockout-latest.debug.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/knockback/node_modules/underscore/underscore.js"
        ],
        "backbone":[
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/backbone/node_modules/backbone/backbone.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/backbone/node_modules/backbone.localstorage/backbone.localStorage.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/backbone/node_modules/underscore/underscore.js"
        ],
        "angularjs":[
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/angularjs/node_modules/angular/angular.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/angularjs/node_modules/angular-resource/angular-resource.js",
        "/Users/madhurimachakraborty/Documents/todomvc-master/examples/angularjs/node_modules/angular-route/angular-route.js"
        ]

}

function filterSCG(SCG){
        for (var key in SCG) {
                if (!(key in prunedSCG)){
                        prunedSCG[key]={}
                }
                
                for(var ckey in SCG[key]){
                        if(!ckey.includes("Native")){
                 
                                key_fileName = ckey.split("@")[0]
                                var values = SCG[key][ckey]
                                for (var val of values) {
                                        if(!val.includes("Native")){
                                                        
                                                val_fileName = val.split("@")[0]

                                                if(key_fileName == val_fileName){
                                                        if (!(ckey in prunedSCG[key])){
                                                                prunedSCG[key][ckey]=[]
                                                        }
                                                        prunedSCG[key][ckey].push(val)
                                                }else{
                                                        if(benchmark in dependencies){
                                                                if((dependencies[benchmark].includes(key_fileName) && dependencies[benchmark].includes(val_fileName))){
                                                                        if (!(ckey in prunedSCG[key])){
                                                                                prunedSCG[key][ckey]=[]
                                                                        }
                                                                        prunedSCG[key][ckey].push(val)
                                                                        continue;
                                                                }
                                                        }
                                                        if (!(fileType[benchmark]['frm'].includes(key_fileName) && fileType[benchmark]["frm"].includes(val_fileName))){
                                                                         if (!(ckey in prunedSCG[key])){
                                                                                        prunedSCG[key][ckey]=[]
                                                                        }
                                                                                prunedSCG[key][ckey].push(val)
                                                        }
                                                               
                                                }
                                        }else{
                                                if (!(ckey in prunedSCG[key])){
                                                        prunedSCG[key][ckey]=[]
                                                }
                                                prunedSCG[key][ckey].push(val)
                                        }
                                }
                        }else{
                                if (!(key in prunedSCG)){
                                        prunedSCG[key]={}
                                }
                                if (!(ckey in prunedSCG[key])){
                                        prunedSCG[key][ckey]=[]
                                }
                                var values = SCG[key][ckey];
                                prunedSCG[key][ckey]= values;
                        }
                }
        }
        //console.log(prunedSCG)
        return prunedSCG
}

function main(){
        if (process.argv.length == 5 ) {

                SCG = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
                fileType = JSON.parse(fs.readFileSync(process.argv[3],"utf8"));
                benchmark = process.argv[4].toString();

                var output = filterSCG(SCG)
                fs.writeFileSync(
                        path.dirname(process.argv[2]) + "/PrunedSCGImp_BND2.json",
                        JSON.stringify(output, null, 2),
                        "utf8",
                        function (err) {
                          if (err) console.log("error", err);
                        }
                );
        }
        
}

main();