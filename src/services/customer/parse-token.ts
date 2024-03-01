import { crypt, redis } from "..";
import { ApiConfig } from "../../config";
import { requestContext } from "@fastify/request-context";
import { CustomerEntity } from "../../entities";

export default async function parseToken(token: string): Promise<{
  twitterToken: string;
  twitterSecret: string;
  userInfo: CustomerEntity
}> {
  try {
    let { twitterToken, twitterSecret, usr } = await crypt.verifyJwt(token);
    return {
      twitterToken,
      twitterSecret,
      userInfo: usr
    };
  } catch (error: any) {
    if (error.err === "expired") {
      //check refresh token
      let decoded = error.decoded;
      return await refreshToken(decoded);
    } else {
      throw error;
    }
  }
  async function refreshToken(data: any): Promise<any> {
    let { usr, twitterToken, twitterSecret, refresh } = data;
    const key = `accesstoken_${usr.id}`;
    let [tokenRefresh, block] = await redis.hmget(key, "block");
    if (tokenRefresh !== refresh) {
      throw new Error("forbidden");
    }
    let jwtInput = {
      twitterToken,
      twitterSecret,
      refresh,
      usr,
    };
    let token = await crypt.signJwt(jwtInput, ApiConfig.JWT_EXPIRE);
    requestContext.set("refreshtoken", token);
    return {
      userInfo: usr,
      block: block,
    };
  }
}
