const fs = require('fs');
var Graph = require('/Users/madhurimachakraborty/Documents/GitHub/jalangi2/experiments/metrics/Graph.js');
var output = new Graph();
//var StatFlow = JSON.parse(fs.readFileSync('/Users/madhurimachakraborty/Documents/PrecMetrics/todo_backbone/FSFGImp_BND2.json', 'utf8'));
var StatFlow = JSON.parse(fs.readFileSync("/Users/madhurimachakraborty/Documents/PrecMetrics/todo_canjs/FSFGImp_BND2.json", 'utf8'));
function jsonToGraph(input) {
        // Converting a json Flow Graph to Graph data structure
        for (var idx in input) {
                var item = input[idx];
                for (var key in item) {
                        output.addEdge(idx, item[key]);
                }
        }
}

function dfs_path(graph, source, sink) {
        const visited = new Array(graph.length).fill(false);
        const path = [source];
    
        function dfs(current) {
            visited[current] = true;
            if (current === sink) {
                return path;
            }
            //console.log(current)
            if(graph[current]){
                for (let neighbor of graph[current]) {
                        if (!visited[neighbor]) {
                        path.push(neighbor);
                        let result = dfs(neighbor);
                        if (result) {
                                return result;
                        }
                        path.pop();
                        }
                }
            }
            return null;
        }
    
        return dfs(source);
    }
      
    function dfs_without_loop(graph, start, end, visited, path) {
        visited[start] = true;
        path.push(start);
      
        if (start === end) {
          return path;
        }
        if(graph[start]){
        for (let neighbor of graph[start]) {
          if (!visited[neighbor]) {
            const result = dfs_without_loop(graph, neighbor, end, visited, path);
            if (result) {
              return result;
            }
          }
        }
        }
        path.pop();
        return null;
      }
      
jsonToGraph(StatFlow);
//console.log(output.getPath("Func(/Users/madhurimachakraborty/Documents/todomvc-master/examples/backbone/node_modules/underscore/underscore.js@79:2664-2727)", "Callee(/Users/madhurimachakraborty/Documents/GitHub/jalangi2/experiments/trex/ft_imp6.js@23:1027-1056)", false))
//console.log(output.getBFS("Func(/Users/madhurimachakraborty/Documents/todomvc-master/examples/backbone/node_modules/underscore/underscore.js@79:2664-2727)"));
console.log(output.getPath("Func(file:/Users/madhurimachakraborty/.m2/repository/com/ibm/wala/com.ibm.wala.cast.js/1.5.9-SNAPSHOT/com.ibm.wala.cast.js-1.5.9-SNAPSHOT.jar!/preamble.js@451:12380-12419)", "Callee(/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/node_modules/jquery/dist/jquery.js@7508:202600-202612)"))
console.log(dfs_path(StatFlow,"Func(file:/Users/madhurimachakraborty/.m2/repository/com/ibm/wala/com.ibm.wala.cast.js/1.5.9-SNAPSHOT/com.ibm.wala.cast.js-1.5.9-SNAPSHOT.jar!/preamble.js@451:12380-12419)", "Callee(/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/node_modules/jquery/dist/jquery.js@7508:202600-202612)"))

var x = dfs_path(StatFlow,"Func(file:/Users/madhurimachakraborty/.m2/repository/com/ibm/wala/com.ibm.wala.cast.js/1.5.9-SNAPSHOT/com.ibm.wala.cast.js-1.5.9-SNAPSHOT.jar!/preamble.js@451:12380-12419)", "Callee(/Users/madhurimachakraborty/Documents/todomvc-master/examples/canjs/node_modules/jquery/dist/jquery.js@7508:202600-202612)").join("\n").toString()
fs.writeFile('myFile.txt', x, (err) => {
        if (err) throw err;
        console.log('Array has been written to file');
      });
      