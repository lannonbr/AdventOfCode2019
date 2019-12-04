# Daily notes

For today's challenge, you could loop through the 100s of thousands of numbers linearly, but a way to speed it up a bit is to know if a number decreases (say 154023), the next number that doesn't decrease actually is the index before it drops repeated through the rest of the number.

So if you have 154023, 5 is right before it drops, so switch it to 155555.

Then in Part 2, there is some ambiguous wording with what they are wanting from it, but basically it equates to that there has to be at least 1 group of matching adjacent numbers of size 2. 

So 123333 would fail because the groups of adjacent numbers are just "3333", so there is no longer a pair of 2.

That said, 122333 has groups of "22" and "333", so given there is the pair of adjacent numbers 22, it passes.