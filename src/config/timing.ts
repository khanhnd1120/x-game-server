import dayjs from "dayjs";

export default class Timing {
  total: number;
  passed: number;
  start_at: Date;
  is_active: boolean;
  public static start(data: Timing) {
    data = Timing.clone(data);
    if (data.is_active) {
      data.passed = data.passed + Timing.calculateDuration(data);
    } else {
      data.is_active = true;
    }
    data.start_at = new Date();
    return data;
  }
  public static stop(data: Timing) {
    data = Timing.clone(data);
    data.is_active = false;
    data.passed = data.passed + Timing.calculateDuration(data);
    return data;
  }
  public static isFinish(data: Timing) {
    return (
      data.passed + Timing.calculateDuration(data) >= data.total &&
      data.is_active
    );
  }
  public static reset(data: Timing) {
    data = Timing.clone(data);
    data.passed = 0;
    data.start_at = new Date();
    return data;
  }
  public static calculateDuration(data: Timing) {
    return dayjs().diff(data.start_at, "second");
  }
  public static clone(t: Timing) {
    return new Timing(t.total, t.passed, t.start_at, t.is_active);
  }
  public static skipTime(t: Timing) {
    if (Timing.isFinish(t)) {
      throw new Error("time_cant_skip");
    }
    t = Timing.clone(t);
    t.passed = t.total;
    return t;
  }
  public static calculateSkippedTime(t: Timing) {
    return t.total - Timing.calculateDuration(t);
  }
  public static changeTotal(t: Timing, total: number) {
    if (total === t.total) {
      return t;
    }
    let data = Timing.clone(t);
    let dur = Timing.calculateDuration(data) + data.passed;
    dur = Math.min(dur, data.total, total);
    data.passed = Math.ceil(dur);
    data.total = Math.ceil(total);
    data.start_at = new Date();
    return data;
  }
  constructor(
    total: number,
    passed: number = 0,
    start_at: Date = new Date(),
    is_active: boolean = true
  ) {
    this.total = Math.ceil(total);
    this.passed = Math.ceil(passed);
    this.start_at = start_at;
    this.is_active = is_active;
  }
}
