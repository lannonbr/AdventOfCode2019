# Daily Notes

For part 1, rather than letting an "AI" run through the maze, I let the user input movement using WASD.

The saved code for part 1 does not contain this, but I had it such that I kept an array of visited locations so if you backtrack, then your current distance would decrease. after each new step I would increment the distance and therefore eventually get to the oxygen station and have my distance as the answer.

For part 2, I ran through the entire maze using part 1, saved that into a file, and then did a flood of the map and saved the max length for each new path and the last one was the one with the longest path.
