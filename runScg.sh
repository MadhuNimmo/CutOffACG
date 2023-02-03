#!/bin/bash
str=(angularjs vue jquery canjs)
#str=(backbone knockoutjs knockback)
#str=(react mithril)
#str=(vanillajs)
cd /Users/madhurimachakraborty/Documents/GitHub/WALA-ACG/
for i in "${str[@]}"
do
echo "Generating SCG for benchmark $i"
#node --max-old-space-size=8192 /Users/madhurimachakraborty/Documents/GitHub/js-callgraph/js-callgraph.js --cg /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ --output /Users/madhurimachakraborty/Documents/CutOffExp/todo_$i/todo_$i --strategy DEMAND --encFuncInfo
./gradlew run --args="/Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/FSMetrics/todo_$i/ OPT"
wait
#./gradlew run --args="/Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/CutOffWALA/todo_$i/ OPT"
#wait
done