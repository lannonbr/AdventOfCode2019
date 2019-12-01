# Daily notes

So after I finished part 2, I was looking at other people's solutions and this one stuck out for me given it was so simple. This is Haskell

```haskell
fuel = subtract 2 . (`div` 3)

part1 = sum . map fuel
part2 = sum . map (sum . tail . takeWhile (>= 0) . iterate fuel)
```

The main point that I was thinking about was that `iterate` function, which gives an infinite list back, but uses lazy evaluation, so it won't start creating entries of that list until you start running it (like how they do with `takeWhile`).

I was thinking about this of having an infinite list to represent the calculation of taking the mass and doing `floor(n/3)-2` until it hit 0, and that can just be an infinite list technically. Then I remembered that JS now has lazy evaluation functionality using generator functions.

So this would create that infinite list in JS:

```js
function* generator(i) {
  let n = i;
  while (true) {
    n = Math.floor(n / 3) - 2;
    yield n;
  }
}
```

and then you can create the generator like so and then pull numbers off of it by calling next

```js
const gen = generator(/* some number */)
gen.next().value // the next value
```