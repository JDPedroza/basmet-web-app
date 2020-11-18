const MergeArraysElements = (arrayBase, arrayMerge) => {
  for (let i = 0; i < arrayMerge.length; i++) {
    arrayBase.push(arrayMerge[i]);
  }
  return arrayBase;
};

export default MergeArraysElements;
