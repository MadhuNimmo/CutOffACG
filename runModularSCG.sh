#!/bin/bash
str=(angularjs vue jquery canjs)
#str=(backbone knockoutjs knockback)
#str=(react mithril)
#str=(vanillajs)
cd /Users/madhurimachakraborty/Documents/GitHub/WALA-ACG/
for i in "${str[@]}"
do
cnt=1
filedir="/Users/madhurimachakraborty/Documents/todomvc-master/examples/$i"
for f in `find $filedir -type f -name "*.js"`
do
echo "Running Metrics for benchmark $i -> file $f"
./gradlew run --args="${f} /Users/madhurimachakraborty/Documents/ModularMetrics/todo_$i/ BND 2 ${cnt}"
((cnt++))
wait
#./gradlew run --args="/Users/madhurimachakraborty/Documents/todomvc-master/examples/$i/ /Users/madhurimachakraborty/Documents/CutOffWALA/todo_$i/ OPT"
#wait
done
done
