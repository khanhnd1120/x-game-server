"use strict";
import * as fastify from "fastify";
import requestTwitter from "../../services/request-twitter";
import customerGuard from "../../guard/customer-guard";
import { CustomerEntity, TwitterQuestEntity } from "../../entities";
import { TwitterQuestType } from "../../config/game-interface";
import { sequelize } from "../../database";
import { Transaction } from "sequelize";

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
      const questInfos: TwitterQuestEntity[] = [];
      console.log(request.twitterToken, request.twitterSecret);
      switch (type) {
        case TwitterQuestType.Follow:
        case TwitterQuestType.Retweeted:
        case TwitterQuestType.Comment:
          const tweetQuest = await requestTwitter.getTweetDataById(
            request.twitterToken,
            request.twitterSecret,
            twitter_quest_id
          );
          if (!tweetQuest) {
            throw new Error("tweet_not_found");
          }
          questInfos.push(
            new TwitterQuestEntity({
              customer_id: customerInfo.id,
              type,
              twitter_quest_id,
            })
          );
          console.log(tweetQuest);
      }
      await sequelize.transaction(async (t: Transaction) => {
        // questInfos.map((questInfo) => questInfo.save({ transaction: t }));
      });
      return { customerInfo, questInfos };
    },
  });
}
