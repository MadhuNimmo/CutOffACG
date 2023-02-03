#!/bin/bash
#FILES="/Users/madhurimachakraborty/Documents/CutOffWALA2/todo_mithril/"
str=(angularjs vue jquery canjs)
#str=(backbone knockoutjs knockback mithril react)
#str=(vanillajs)
newline=$'\n'
for i in "${str[@]}"
do
res="Iteration,Precision,Recall${newline}"
filedir="/Users/madhurimachakraborty/Documents/CutOffWALA2/todo_$i/"
for f in `ls $filedir`
do
if [[ $f == *SCG* ]]
then
echo "Running Metrics for benchmark $i -> file $f"
res+=$(echo "${f//[^0-9]/}")$","
res+=$(node --max-old-space-size=8192 metric3.js /Users/madhurimachakraborty/Documents/CutOffWALA2/todo_${i}/DCG.json $filedir$f /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/CutOffWALA2/analysis_results.json $i)
res+="${newline}"
fi
done
printf "${res}" > ${filedir}Metrics3.xls
done