#!/bin/bash
#str=(angularjs vue jquery canjs backbone knockoutjs knockback)
str=(react vanillajs mithril)
for i in "${str[@]}"
do
echo "Generating SCG for benchmark $i"
node --max-old-space-size=8192 /Users/madhurimachakraborty/Documents/GitHub/js-callgraph/js-callgraph.js --cg /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ --output /Users/madhurimachakraborty/Documents/CutOffExp/todo_$i/todo_$i --strategy DEMAND --encFuncInfo
wait
done