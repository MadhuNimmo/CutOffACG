#!/bin/bash
str=(vue jquery canjs backbone knockoutjs knockback react mithril vanillajs angularjs)
#str=(vanillajs)
cd /Users/madhurimachakraborty/Documents/GitHub/WALA-ACG/
#cd /Users/madhurimachakraborty/Documents/GitHub/jalangi2/
for i in "${str[@]}"
do
for j in {0..5}
do
echo "Generating SCG for benchmark $i"
./gradlew run --args="/Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/BoundedWeb/todo_$i/ BND $j"
#node experiments/metrics/metric3.js /Users/madhurimachakraborty/Documents/BoundedExp/todo_$i/todo_${i}_DCG.json /Users/madhurimachakraborty/Documents/BoundedExp/todo_$i/SCG_BND${j}.json /Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/BoundedExp/analysis_results.json ${i}
wait
done
done