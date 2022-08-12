/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const stringToArray = string.split("");
  let amountEqualSymbs = 0;
  let prevSymb = stringToArray[0];
  let currentSymb;
  let isEqualSymbs;

  if (size === 0) {
    return "";
  }

  if (!size) {
    return string;
  }

  return stringToArray
    .filter(
      elem => {
        currentSymb = elem;
        isEqualSymbs = prevSymb === currentSymb;
        prevSymb = currentSymb;

        if (isEqualSymbs && (amountEqualSymbs < size)) {
          amountEqualSymbs++;
          return true;
        }

        if (!isEqualSymbs) {
          amountEqualSymbs = 1;
          return true;
        }

        return false;
      })
    .join("");
}

