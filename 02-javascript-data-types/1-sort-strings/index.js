/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];
  const collator = new Intl.Collator("ru", {caseFirst: "upper"});

  if (param.trim().toLowerCase() === 'desc') {
    return arrCopy.sort(collator.compare).reverse();
  }

  return arrCopy.sort(collator.compare);
}
