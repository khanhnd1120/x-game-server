import OAuth from "oauth";
import { ConfigEntity, CustomerEntity, NewbieQuestEntity } from "../entities";
import { TwitterApi, TwitterApiReadOnly } from "twitter-api-v2";
import { ConfigKey, TwitterQuestType } from "../config/game-interface";
import { sequelize } from "../database";
import { Transaction } from "sequelize";

let oauth: OAuth.OAuth = null;
let oauth2: OAuth.OAuth2 = null;
let twitterClient: TwitterApiReadOnly = null;
async function getOauth() {
  if (!oauth) {
    oauth = new OAuth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      process.env.TWITTER_API_KEY ?? "",
      process.env.TWITTER_API_SECRET_KEY ?? "",
      "1.0A",
      null,
      "HMAC-SHA1"
    );
  }
  if (!oauth2) {
    oauth2 = new OAuth.OAuth2(
      process.env.TWITTER_API_KEY ?? "",
      process.env.TWITTER_API_SECRET_KEY ?? "",
      "https://api.twitter.com/",
      null,
      "oauth2/token",
      null
    );
    await new Promise((resolve, reject) => {
      oauth2.getOAuthAccessToken(
        "",
        { grant_type: "client_credentials" },
        function (e, access_token, refresh_token, results) {
          const twitterApi = new TwitterApi(access_token);
          twitterClient = twitterApi.readOnly;
          resolve(twitterClient);
        }
      );
    });
  }
}
async function twitterGetReqByOauth(
  url: string,
  token: string,
  secret: string
) {
  return new Promise((resolve, reject) => {
    oauth.getProtectedResource(
      url,
      "GET",
      token,
      secret,
      (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
}

async function requestTwitterToken() {
  getOauth();
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
  getOauth();
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

  let twitterUserData: any = await twitterGetReqByOauth(
    "https://api.twitter.com/2/users/me",
    response.token,
    response.secret
  );

  if (!twitterUserData) {
    throw new Error("cannot_verify_twitter");
  }
  twitterUserData = JSON.parse(twitterUserData);
  let customerInfo = await CustomerEntity.findOne({
    where: {
      twitter_id: twitterUserData.data.id,
    },
  });
  if (!customerInfo) {
    customerInfo = new CustomerEntity({
      twitter_id: twitterUserData.data.id,
      twitter_username: twitterUserData.data.username,
      point: 0,
    });
    let newbieQuestInfos: NewbieQuestEntity[] = [];
    const questConfig = ConfigEntity.getConfig(ConfigKey.SETTING_TWITTER_QUEST);
    [TwitterQuestType.Liked, TwitterQuestType.Follow].map((type) => {
      newbieQuestInfos.push(
        new NewbieQuestEntity({
          type,
          rewards: questConfig[type].rewards,
          twitter_quest_username: "Monsterra_P2E",
        })
      );
    });
    console.log(newbieQuestInfos)
    await sequelize.transaction(async (t: Transaction) => {
      await customerInfo.save({ transaction: t });
      await Promise.all(
        newbieQuestInfos.map(async (quest) => {
          quest.customer_id = customerInfo.id;
          await quest.save({ transaction: t });
        })
      );
    });
  }

  return {
    ...response,
    customerInfo,
  };
}

async function getTwitterUserDataById(
  access_token: string,
  access_token_secret: string,
  id: string
) {
  await getOauth();
  let response: any = await twitterGetReqByOauth(
    `https://api.twitter.com/2/users/${id}`,
    access_token,
    access_token_secret
  );

  if (!response) {
    throw new Error("cannot_verify_twitter");
  }
  return JSON.parse(response);
}
async function getTweetDataById(id: string) {
  await getOauth();

  const response = await twitterClient.v2.get(
    `tweets/${id}?expansions=author_id&user.fields=username`
  );

  if (!response) {
    throw new Error("tweet_not_found");
  }
  return response;
}
async function getCommentOfTweet(tweetId: string, authId: string) {
  const response = await twitterClient.v2.get(
    `tweets/search/recent?query=conversation_id:${tweetId}%20from:${authId}`
  );

  if (!response) {
    throw new Error("tweet_not_found");
  }
  return response;
}
async function getRetweetOfTweet(tweetId: string, authId: string) {
  const response = await twitterClient.v2.get(
    `tweets/search/recent?query=retweets_of_tweet_id:${tweetId}%20from:${authId}`
  );

  if (!response) {
    throw new Error("tweet_not_found");
  }
  return response;
}
const requestTwitter = {
  requestTwitterToken,
  accessTwitterToken,
  getTwitterUserDataById,
  getTweetDataById,
  getCommentOfTweet,
  getRetweetOfTweet,
};

export default requestTwitter;
