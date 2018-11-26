export function fillRange(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, index) => start + index);
}

export function flattenMixedArray(mixedArray) {
  return mixedArray.reduce((prev, curr) => {
    if (Array.isArray(curr)) {
      return prev.concat(curr);
    }
    prev.push(curr);
    return prev;
  }, []);
}
