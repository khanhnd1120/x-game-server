import { ApiConfig } from "../../config";
import { UserEntity } from "../../entities";
import crypt from "../crypt";
import redis from "../redis";

export default async function generateAdminToken(
  userInfo: UserEntity
): Promise<string> {
  const key = `admin_token_${userInfo.id}`;
  let uid = crypt.generateToken();
  await redis.hmset(key, {
    user_info: JSON.stringify(userInfo),
    admin_uid: uid,
  });
  await redis.expire(key, ApiConfig.JWT_EXPIRE);
  return `${userInfo.id}:${uid}`;
}
