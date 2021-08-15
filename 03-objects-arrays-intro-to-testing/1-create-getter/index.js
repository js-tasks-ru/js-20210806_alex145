/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return obj => {
    const path_ = path.split(".");
    let res = {...obj};
    for (let index in path_) {
      if (res[path_[index]] === undefined) {
        res = undefined;
        break;
      } else {
        res = res[path_[index]];
      }
    }
    return res;
  };
}
