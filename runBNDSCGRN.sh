#!/bin/bash
#str=(angularjs vue jquery canjs backbone)
#str=(knockoutjs knockback react mithril)
#str=(knockoutjs)
cd /Users/madhurimachakraborty/Documents/GitHub/WALA-ACG/
#cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
for j in {0..5}
do
echo "Generating SCG for benchmark $i"
./gradlew run --args="/Users/madhurimachakraborty/Documents/BoundedRN/blank-scg/BundledCode.js /Users/madhurimachakraborty/Documents/BoundedRN/blank-scg/ OPT -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/Users/madhurimachakraborty/Documents/BoundedRN/blank-scg/"
#node experiments/metrics/metric3.js /Users/madhurimachakraborty/Documents/BoundedExp/todo_$i/todo_${i}_DCG.json /Users/madhurimachakraborty/Documents/BoundedExp/todo_$i/SCG_BND${j}.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/BoundedExp/analysis_results.json ${i}
wait
done