#!/bin/bash
#FILES="/Users/madhurimachakraborty/Documents/CutOffWALA2/todo_mithril/"
str=(angularjs vue jquery canjs react mithril)
#str=(backbone knockoutjs knockback)
#str=(vanillajs)
cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
for i in "${str[@]}"
do
filedir="/Users/madhurimachakraborty/Documents/FSMetrics/todo_${i}"
for f in `ls $filedir`
do
if [[ $f == FSSCG_OPT.json ]]
then
echo "Running Metrics for benchmark $i -> file $f"
node --max-old-space-size=8192 experiments/metrics/metric3.js ${filedir}/todo_${i}_DCG.json $filedir/FSSCG_OPT.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/FSMetrics/analysis_results.json $i
#node experiments/metrics/StatVSDynEdgesCominStat.js $filedir/todo_${i}_DCG.json $filedir/SCG_OPT.json $filedir/FSSCG_OPT.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ $filedir
fi
done
done