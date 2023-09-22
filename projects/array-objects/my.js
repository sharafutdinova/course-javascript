function isAllTrue(array, fn) {
  try {
    if (!Array.isArray(array)) {
      throw new Error('array не массив');
    } else if (array.length === 0) {
      throw new Error('пустой массив');
    } else if (typeof fn() == 'function') {
      throw new Error('fn is not a function');
    }
    let check = true;
    array.forEach((element) => {
      if (!fn(element)) check = false;
    });
    return check;
  } catch (e) {
    console.log(e.message);
  }
}

console.log(isAllTrue([], (n) => n < 10));
isAllTrue([1, 2, 3, 4, 5], (n) => n < 10); // вернет true (потому что все элементы массива меньше 10)
isAllTrue([100, 2, 3, 4, 5], (n) => n < 10); // вернет false (потому что как минимум первый элемент больше 10)
