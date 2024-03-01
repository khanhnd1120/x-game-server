import ApiConfig from "../../config/api-config";
import { crypt, redis } from "../../services";

export default async function generateToken(
  twitterToken: string,
  twitterSecret: string,
  customerId: number
): Promise<string> {
  const refresh = crypt.uid();
  const key = `accesstoken_${1}`;
  await redis.set(key, refresh);
  let input = {
    twitterToken,
    twitterSecret,
    refresh,
    usr: {
      id: customerId,
    },
  };
  let jwtInput = input;
  let token = await crypt.signJwt(jwtInput, ApiConfig.JWT_EXPIRE);
  return token;
}
