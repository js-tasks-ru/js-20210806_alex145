/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  const res = {};

  if (typeof obj !== "object") {
    return undefined;
  }

  Object.keys(obj).forEach(key => {
    res[obj[key]] = key;
  });

  return res;
}
