#!/bin/bash
#str=(angularjs vue backbone knockoutjs knockback)
#str=(react)
str=(vanillajs mithril canjs jquery)
cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
for i in "${str[@]}"
do
echo "Generating DCG for benchmark $i"
node --max-old-space-size=8192 /Users/madhurimachakraborty/Documents/GitHub/jalangi2/experiments/pupServ.js /Users/madhurimachakraborty/Documents/todomvc-master/examples/${i}/ /Users/madhurimachakraborty/Documents/FSResults/todo_${i}/todo_${i}_DCG.json
#node --max-old-space-size=8192 /Users/madhurimachakraborty/Documents/GitHub/jalangi2/experiments/pupServ.js /Users/madhurimachakraborty/Documents/todomvc-master/examples/${i}/ /Users/madhurimachakraborty/Documents/DynTraces/todo_${i}/DCG.json
#node --max-old-space-size=8192 experiments/pupServ2.js /Users/madhurimachakraborty/Documents/todomvc-master/examples/${i}/ /Users/madhurimachakraborty/Documents/DynTraces/todo_${i}/todo_${i}_trace.json /Users/madhurimachakraborty/Documents/BoundedExp/todo_${i}/calleeMap.json
wait
done