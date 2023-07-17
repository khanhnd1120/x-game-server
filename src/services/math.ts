import * as mathjs from "mathjs";
function randomInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}
function add(a: number, b: number): number {
  return Number(mathjs.format(a + b, { precision: 14 }));
}
const math = { randomInt, add };
export default math;
