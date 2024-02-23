import OAuth from "oauth";

async function requestTwitterToken() {
  let oauth = new OAuth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.TWITTER_API_KEY ?? "",
    process.env.TWITTER_API_SECRET_KEY ?? "",
    "1.0A",
    null,
    "HMAC-SHA1"
  );

  let response: any = await new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken((error, token, secret) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          token,
          secret,
        });
      }
    });
  });

  if (!response) {
    throw new Error("cannot_verify_twitter");
  }
  return response;
}

async function accessTwitterToken({
  token,
  verifier,
  secret,
}: {
  token: string;
  verifier: string;
  secret: string;
}) {
  let oauth = new OAuth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.TWITTER_API_KEY ?? "",
    process.env.TWITTER_API_SECRET_KEY ?? "",
    "1.0A",
    null,
    "HMAC-SHA1"
  );

  let response: any = await new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(
      token,
      secret,
      verifier,
      (error, token, secret) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            token,
            secret,
          });
        }
      }
    );
  });

  if (!response) {
    throw new Error("cannot_verify_twitter");
  }
  return response;
}

const requestTwitter = {
  requestTwitterToken,
  accessTwitterToken,
};

export default requestTwitter;
