import ApiConfig from "../../config/api-config";
import { crypt } from "../../services";

export default async function generateToken(
  twitterToken: string,
  twitterSecret: string
): Promise<string> {
  const refresh = crypt.uid();
  let input = {
    twitterToken,
    twitterSecret,
    refresh,
    usr: {
      id: 1,
    },
  };
  let jwtInput = input;
  let token = await crypt.signJwt(jwtInput, ApiConfig.JWT_EXPIRE);
  return token;
}
