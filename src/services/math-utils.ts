import * as mathjs from "mathjs";
function randomInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}
function add(a: number, b: number): number {
  return Number(mathjs.format(a + b, { precision: 14 }));
}
function randomByWeight(percents: number[]) {
  let total = percents.reduce((rs: number, item: number) => rs + item);
  let rnd = randomInt(0, total - 1);
  let sum = 0;
  for (var i = 0; i < percents.length; i++) {
    sum += percents[i];
    if (sum > rnd) {
      return i;
    }
  }
}
function parseReferralCode(code: string) {
  let a = code.substring(2, code.length);
  let rs = parseInt(a, 36) - 10000000000;
  return rs;
}
function generateReferral(id: number) {
  let a = id + 10000000000;
  return `MS${a.toString(36)}`.toUpperCase();
}
const mathUtils = {
  randomInt,
  add,
  randomByWeight,
  parseReferralCode,
  generateReferral,
};
export default mathUtils;
