# Daily notes

For part 2, you have to figure out which set of two numbers result in 19690720

Brute force works, but after going through a few rounds, the output number increments slowly as we increment pos 2, so we can skip going throuh a round of searching through all of the values in pos 2 if it is not within a range of 100 outside our target value (19690620 to 19690820). This reduced the number of runs for my input from 7196 to 167.

Then, I optimized it further as instead of looking at the numbers linearly, I could just do two binary searches and get my resulting numbers. This reduces the number of runs from my first optimization of 167 down to just 14 runs. That is over a 500x speedup compared to my original 7196 runs.