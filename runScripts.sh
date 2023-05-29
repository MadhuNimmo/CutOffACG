#!/bin/bash
#FILES="/Users/madhurimachakraborty/Documents/CutOffWALA2/todo_mithril/"
str=(angularjs vue jquery canjs react mithril knockoutjs backbone knockback vanillajs)
#str=(knockoutjs backbone knockback)
#str=(vue)
#str=(react mithril)
cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
for i in "${str[@]}"
do
filedir="/Users/madhurimachakraborty/Documents/NewDCG/todo_${i}"
for f in `ls $filedir`
do
if [[ $f == FSFLowSCGTest4_BND2.json ]]
then
echo "Running Metrics for benchmark $i -> file $f"
node --max-old-space-size=8192 experiments/metrics/metric3.js ${filedir}/todo_${i}_DCG.json $filedir/FSFLowSCGTest4_BND2.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/NewDCG/analysis_results.json $i
#node experiments/metrics/StatVSDynEdgesCominStat.js $filedir/todo_${i}_DCG.json /Users/madhurimachakraborty/Documents/FSMetrics/todo_${i}/SCG_OPT.json $filedir/FSFSSCGTest_BND2_EDIT.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ $filedir
#node experiments/metrics/StatVSDynDiffCallee.js $filedir/todo_${i}_DCG.json $filedir/FSFLowSCGTest4_BND2.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ $filedir
#node /Users/madhurimachakraborty/Documents/GitHub/CutOffACG/pruneCrossFileEdges.js /Users/madhurimachakraborty/Documents/NewDCG/todo_${i}/FSSCGImp_BND2.json /Users/madhurimachakraborty/Documents/NewDCG/analysis_results.json ${i}
fi
done
done