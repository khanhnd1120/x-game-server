import schedule from "node-schedule";
import { Environment } from "./config/environment";

export default async function cronjob() {
  if (Environment.IS_WORKER) {
    return;
  }
}
