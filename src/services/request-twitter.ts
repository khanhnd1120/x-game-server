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

async function getTwitterUserData(
  access_token: string,
  access_token_secret: string
) {
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
    oauth.get(
      "https://api.twitter.com/2/users/1759852630161907712/liked_tweets",
      access_token,
      access_token_secret,
      (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          console.log(data);
          console.log("dmmmmmmmmmmmmmmmmmm")
          resolve(data);
        }
      }
    );
    // oauth.getProtectedResource(
    //   "https://api.twitter.com/1.1/account/verify_credentials.json",
    //   "GET",
    //   access_token,
    //   access_token_secret,
    //   (error, data, response) => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       console.log(data);
    //       resolve(data);
    //     }
    //   }
    // );
  });

  if (!response) {
    throw new Error("cannot_verify_twitter");
  }
  return JSON.parse(response);
}

const requestTwitter = {
  requestTwitterToken,
  accessTwitterToken,
  getTwitterUserData,
};

export default requestTwitter;
