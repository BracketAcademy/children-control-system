export function toPersianDigit(str) {
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(str).replace(/[0-9]/g, (w) => id[+w]);
}

export function toEnglishDigit(str) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const enNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
  let result = str;
  if (typeof result === "string") {
    for (let i = 0; i < 10; i++) {
      result = result.replace(persianNumbers[i], i).replace(enNumbers[i], i);
    }
  }
  return result;
}
