import { UserEntity } from "../../entities";
import redis from "../redis";

export default async function parseAdminToken(token: string): Promise<{
  userInfo: UserEntity;
}> {
  let [id, _uid] = token.split(":");
  if (!(id && _uid)) {
    throw new Error("invalid_token");
  }
  const key = `admin_token_${id}`;
  let { user_info, admin_uid } = await redis.hgetall(key);
  let userInfo: UserEntity = JSON.parse(user_info);
  if (admin_uid !== _uid) {
    throw new Error("forbidden");
  }
  return { userInfo };
}
