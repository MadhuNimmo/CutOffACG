/**
 * Graph Implemention based on {@link https://www.geeksforgeeks.org/implementation-graph-javascript/}
 */
var Queue = require("./Queue.js");
var validPaths = [];
class Graph {
  // defining an adjacent list
  constructor() {
    this.AdjList = new Map();
  }

  // add vertex to the graph
  addVertex(v) {
    // initialize the adjacent list with a  null array
    this.AdjList.set(v, []);
  }

  // add edge to the graph
  addEdge(caller, callee) {
    // get the list for caller and put the
    // callee denoting edge between caller and callee
    if (!this.AdjList.has(caller)) {
      this.addVertex(caller);
    }
    if (!this.AdjList.get(caller).includes(callee)) {
      this.AdjList.get(caller).push(callee);
    }
  }
  // removing an edge from the graph
  removeEdge(caller, callee) {
    if (
      this.hasEdge(caller, callee) &&
      this.AdjList.get(caller).includes(callee)
    ) {
      if (this.getValues(caller).length == 1) {
        this.AdjList.delete(caller);
      } else {
        var index = this.AdjList.get(caller).indexOf(callee);
        if (index >= 0) {
          this.AdjList.get(caller).splice(index, 1);
        }
      }
    }
    return this.AdjList;
  }
  // identifying if an edge is present
  hasEdge(caller, callee) {
    return (
      this.AdjList.has(caller) && this.AdjList.get(caller).includes(callee)
    );
  }
  // returns all possible keys of the graph
  getKeys() {
    return this.AdjList.keys();
  }
  // returns all possible values pertaining
  //to a key in the graph
  getValues(key) {
    return this.AdjList.get(key);
  }
  //to get all the child nodes present in the graph
  getAllChildNodes() {
    var output = [];
    var get_keys = this.getKeys();

    // iterate over all the keys
    for (var i of get_keys) {
      var get_values = this.AdjList.get(i);
      // iterate over all the values
      for (var j of get_values) {
        if (!output.includes(j)) {
          output.push(j);
        }
      }
    }
    return output;
  }
  //get all vertices
  getNodes() {
    var output = [];
    var get_keys = this.getKeys();

    // iterate over all the keys
    for (var i of get_keys) {
      if (!output.includes(i)) {
        output.push(i);
      }
      var get_values = this.AdjList.get(i);
      // iterate over all the values
      for (var j of get_values) {
        // format the egde in the form
        // caller -> callee
        if (!output.includes(j)) {
          output.push(j);
        }
      }
    }
    return output;
  }
  //to get all the edges present in the graph
  getAllEdges() {
    var output = new Graph();
    var get_keys = this.getKeys();

    // iterate over all the keys
    for (var i of get_keys) {
      var get_values = this.AdjList.get(i);
      // iterate over all the values
      for (var j of get_values) {
        if (!output.hasEdge(i, j)) {
          output.addEdge(i, j);
        }
      }
    }
    return output;
  }
  //to get the size of a graph a level-1 graph
  getSize() {
    // returns the number of edges
    var cnt = 0;
    var get_keys = this.getKeys();

    // iterate over all the keys
    for (var i of get_keys) {
      var get_values = this.AdjList.get(i);
      // iterate over all the values
      /*for (var j of get_values) {
                                cnt += 1;
                        }*/
      cnt += get_values.length;
    }
    return cnt;
  }
  //to get the text version of the graph
  getGraph() {
    var txt = "";
    var get_keys = this.getKeys();
    var out = {};
    // iterate over all the keys
    for (var i of get_keys) {
      out[i] = [];
      var get_values = this.AdjList.get(i);
      // iterate over all the values
      for (var j of get_values) {
        // format the egde in the form
        // caller -> callee
        out[i].push(j);
      }
    }
    return out;
    //return txt.trim()
  }
  // function to performs BFS
  getBFS(startingNode) {
    var output = [];
    // create a visited array
    var visited = [];
    // Create an object for queue
    var q = new Queue();

    // add the starting node to the queue
    visited[startingNode] = true;
    q.enqueue(startingNode);

    // loop until queue is element
    while (!q.isEmpty()) {
      // get the element from the queue
      var getQueueElement = q.dequeue();

      // passing the current vertex to callback funtion
      output.push(getQueueElement);

      // get the adjacent list for current vertex
      var get_List = this.AdjList.get(getQueueElement);

      // loop through the list and add the element to the
      // queue if it is not processed yet
      for (var i in get_List) {
        //cnt+=1
        var neigh = get_List[i];

        if (!visited[neigh]) {
          visited[neigh] = true;
          q.enqueue(neigh);
        }
      }
    }
    return output;
  }
  //function to get the path given a source and destination
  getPath(src, dest, ifAtAll = false) {
    var visited = [];
    return this.getPathUtil(src, dest, visited, ifAtAll);
  }
  //utility function to generate the path between two given points
  getPathUtil(src, dest, visited, ifAtAll = false) {
    if (src === dest) {
      return true;
    }

    visited[src] = true;

    var get_neighbours = this.AdjList.get(src);

    for (var i in get_neighbours) {
      // if the neighbor hasn't been visited
      //new change to get rid of scg edges with all paths found
      if (
        ifAtAll == false &&
        get_neighbours[i] != "Unknown" &&
        get_neighbours[i] != "Prop($$undefined)" &&
        !visited[get_neighbours[i]]
      ) {
        // go down the path & determine if dest has been reached
        let reached = this.getPathUtil(get_neighbours[i], dest, visited);
        // return true if dest has been reached
        if (reached) return true;
      } else if (ifAtAll == true && !visited[get_neighbours[i]]) {
        // go down the path & determine if dest has been reached
        let reached = this.getPathUtil(get_neighbours[i], dest, visited, true);
        // return true if dest has been reached
        if (reached) return true;
      }
    }
    return false;
  }
  //new
  createVisitedObject() {
    let arr = {};
    for (let key of this.AdjList.keys()) {
      arr[key] = false;
    }
    return arr;
  }

  doesPathExist(firstNode, secondNode) {
    // we will approach this BFS way
    console.log("End");
    let path = [];
    console.log("Start");
    let visited = this.createVisitedObject();
    let q = [];
    visited[firstNode] = true;
    q.push(firstNode);
    while (q.length) {
      let node = q.pop();
      path.push(node);

      let elements = this.AdjList.get(node);
      if (elements != undefined) {
        if (elements.includes(secondNode)) {
          console.log(path.join("->"));
          return true;
        } else {
          for (let elem of elements) {
            if (!visited[elem]) {
              visited[elem] = true;
              q.unshift(elem);
            }
          }
        }
      }
    }
    return false;
  }
}

module.exports = Graph;
