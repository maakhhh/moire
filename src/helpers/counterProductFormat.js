export default function counterProductFormat(number) {
  const lastone = +number % 10;

  if (number < 21 && number > 4) {
    return `${number} товаров`;
  }

  if (+lastone === 1) {
    return `${number} товар`;
  }
  if (+lastone < 5 && +lastone > 0) {
    return `${number} товара`;
  }
  return `${number} товаров`;
}
