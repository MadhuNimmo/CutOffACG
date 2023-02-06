#!/bin/bash
#str=(angularjs vue jquery canjs react mithril)
cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
filedir="/Users/madhurimachakraborty/Documents/BoundedRN/blank-scg/"
for f in `ls $filedir`
do
if [[ $f == SCG_BND* ]]
then
echo "Running Metrics for benchmark $i -> file $f"
node --max-old-space-size=8192 experiments/metrics/metric31.js ${filedir}/DCG.json ${filedir}/${f} ${filedir}
#node experiments/metrics/StatVSDynEdgesCominStat.js $filedir/todo_${i}_DCG.json $filedir/SCG_OPT.json $filedir/FSSCG_OPT.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ $filedir
fi
done