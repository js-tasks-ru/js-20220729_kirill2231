/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

  if (isUndefinedObj(obj)) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(obj).map(item => {
      let [value2, value1] = item;
      return [value1, value2];
    })
  );
}

export function isUndefinedObj(obj) {
  return (obj === undefined) ? true : false;
}

