#!/bin/bash
#FILES="/Users/madhurimachakraborty/Documents/CutOffExp/todo_mithril/"
#str=(angularjs vue jquery canjs)
#str=(backbone knockoutjs knockback)
str=(react)
for i in "${str[@]}"
do
filedir="/Users/madhurimachakraborty/Documents/CutOffExp/todo_$i/"
for f in `ls $filedir`
do
if [[ $f == *JSSCG* ]]
then
echo "Running Metrics for benchmark $i -> file $f"
node --max-old-space-size=8192 metric3.js /Users/madhurimachakraborty/Documents/CutOffExp/todo_${i}_DCG.json $filedir$f /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/CutOffExp/analysis_results.json $i
fi
done
done