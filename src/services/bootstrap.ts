import { Environment } from "../config/environment";

export default async function bootstrap() {
  if (Environment.IS_WORKER) {
    return;
  }
  console.log("refresh leader board arena");
}
