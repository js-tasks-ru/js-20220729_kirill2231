/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let arrCopy = [...arr];

  if (param === 'asc') {
    arrCopy.sort( (a, b) => a.localeCompare(b, ['ru', 'eng'], { caseFirst: 'upper' }));
  }

  if (param === 'desc') {
    arrCopy.sort( (a, b) => -a.localeCompare(b, ['ru', 'eng'], { caseFirst: 'lower' }));
  }

  return arrCopy;
}

sortStrings(['абрикос', 'Абрикос', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик'], 'asc');
