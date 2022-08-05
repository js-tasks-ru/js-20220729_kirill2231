/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];
  const caseFirst = param === 'asc' ? 'upper' : 'lower';
  const sortFactor = param === 'asc' ? 1 : -1;

  arrCopy.sort((a, b) => sortFactor * a.localeCompare(b, ['ru', 'eng'], { caseFirst: caseFirst }));

  return arrCopy;
}
