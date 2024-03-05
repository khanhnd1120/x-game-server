"use strict";
import * as fastify from "fastify";
import requestTwitter from "../../services/request-twitter";
import customerGuard from "../../guard/customer-guard";
import {
  ConfigEntity,
  CustomerEntity,
  TwitterQuestEntity,
} from "../../entities";
import {
  ConfigKey,
  TwitterQuestStatus,
  TwitterQuestType,
} from "../../config/game-interface";
import { sequelize } from "../../database";
import { Transaction } from "sequelize";
import claimReward from "../../services/customer/claim-rewards";

export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/claim-tweet-quest",
    schema: {
      body: {
        type: "object",
        properties: {
          type: { type: "number" },
          twitter_quest_id: { type: "string" },
        },
        required: ["type", "twitter_quest_id"],
      },
    },
    preHandler: [customerGuard],
    handler: async function (request: any) {
      const customerInfo = await CustomerEntity.findByPk(request.user.id);
      if (!customerInfo) {
        throw new Error("customer_not_found");
      }
      const { type, twitter_quest_id } = request.body;
      if (
        ![TwitterQuestType.Retweeted, TwitterQuestType.Comment].includes(type)
      ) {
        throw new Error("invalid_type");
      }
      const questConfig = ConfigEntity.getConfig(
        ConfigKey.SETTING_TWITTER_QUEST
      );
      if (!questConfig[type]) {
        throw new Error("config_not_found");
      }

      const tweetQuest = await requestTwitter.getTweetDataById(
        twitter_quest_id
      );
      if (!tweetQuest) {
        throw new Error("tweet_not_found");
      }
      const { data, includes } = tweetQuest;
      const authId = data.author_id;
      const authUsername = includes.users.find(
        (user: any) => user.id == authId
      );
      const whitelist = ConfigEntity.getConfig(
        ConfigKey.WHITE_LIST_X_ACCOUNT_SHOW_QUEST
      );
      if (!whitelist.includes(authUsername)) {
        // throw new Error("not_in_whitelist");
      }
      let isComplete = false;
      switch (type) {
        case TwitterQuestType.Comment:
          const tweetComments = await requestTwitter.getCommentOfTweet(
            twitter_quest_id,
            customerInfo.twitter_id
          );
          if (!tweetComments.data) {
            throw new Error("not_complete");
          }
          tweetComments.data.map((tweetComment: any) => {
            if (
              tweetComment.text.includes("xgame") &&
              tweetComment.text.length > 16
            ) {
              isComplete = true;
            }
          });
          break;
        case TwitterQuestType.Retweeted:
          const tweetRetweets = await requestTwitter.getRetweetOfTweet(
            twitter_quest_id,
            customerInfo.twitter_id
          );
          if (
            tweetRetweets &&
            tweetRetweets.data &&
            tweetRetweets.data.length > 0
          ) {
            isComplete = true;
          }
          break;
      }
      if (!isComplete) {
        throw new Error("not_complete");
      }
      const newQuest = new TwitterQuestEntity({
        customer_id: customerInfo.id,
        type,
        twitter_quest_id,
        status: TwitterQuestStatus.Claimed,
        is_claim: true,
        rewards: questConfig[type].rewards,
      });
      await sequelize.transaction(async (t: Transaction) => {
        await newQuest.save({ transaction: t });
        await claimReward({
          customerInfo,
          rewards: newQuest.rewards,
          transaction: t,
        });
      });
      return { customerInfo, questInfo: newQuest };
    },
  });
}
