import VerifyJWTToken from "../services/customer/verify-token";

export default async function customerGuard(req: any) {
  try {
    const { twitterToken, twitterSecret } = await VerifyJWTToken(
      req.headers.authorization
    );
    req.twitterToken = twitterToken;
    req.twitterSecret = twitterSecret;
  } catch (error) {
    throw error;
  }
}
