#!/bin/bash
#str=(angularjs vue jquery canjs backbone knockoutjs knockback)
str=(react)
cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
for i in "${str[@]}"
do
echo "Generating DCG for benchmark $i"
node --max-old-space-size=8192 /Users/madhurimachakraborty/Documents/GitHub/jalangi2/experiments/pupServ.js /Users/madhurimachakraborty/Documents/todomvc-master/examples/${i}/ /Users/madhurimachakraborty/Documents/CutOffExp/todo_${i}_DCG.json
wait
done