import parseToken from "./parse-token";
import { requestContext } from "@fastify/request-context";

export default async function VerifyJWTToken(authorization: string) {
  if (!authorization) {
    throw new Error("forbidden");
  }
  try {
    let token = authorization.split(" ")[1];
    let { twitterToken, twitterSecret } = await parseToken(token);
    requestContext.set("twitterToken", twitterToken);
    requestContext.set("twitterSecret", twitterSecret);
    return { twitterToken, twitterSecret };
  } catch (error) {
    throw new Error("forbidden");
  }
}
