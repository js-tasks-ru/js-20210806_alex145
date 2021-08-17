/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let repeats = 0;
  let removeIndexes = [];

  if (size === 0) {
    return "";
  } else if (size === undefined) {
    return string;
  }

  string = string.split('');

  for (let index in string) {
    if (string[index] === string[++index]) {
      repeats++;
      if (repeats >= size) {
        removeIndexes.push(index);
        repeats--;
      }
    } else {
      repeats = 0;
    }
  }
  removeIndexes.forEach(item => {
    string[item] = null;
  });
  return string.filter(value => value !== null).join('');
}
