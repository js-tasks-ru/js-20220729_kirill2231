/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const stringToArray = path.split(".");

  return function(obj) {
    return Object.keys(obj).length === 0 ? undefined : stringToArray.reduce((result, item) => result[item], obj);
  };
}