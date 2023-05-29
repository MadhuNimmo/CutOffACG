#!/bin/bash
filedir="/Users/madhurimachakraborty/Documents/GitHub/Bound-Analysis/examples/"
cd /Users/madhurimachakraborty/Documents/GitHub/WALA-ACG/
for f in `ls $filedir`
do
if [[ $f == example80.js ]]
then
./gradlew run --args="${filedir}/${f}/ /Users/madhurimachakraborty/Documents/StaticResults/examples/${f} BND 2"
wait
fi
done