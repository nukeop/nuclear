export const swap = (arr, index1, index2) => arr.map((val, idx) => {
  if (idx === index1) {
    return arr[index2];
  }
  if (idx === index2) {
    return arr[index1];
  }
  return val;
});
