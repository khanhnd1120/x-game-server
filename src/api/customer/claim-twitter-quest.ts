"use strict";
import * as fastify from "fastify";
import requestTwitter from "../../services/request-twitter";
import customerGuard from "../../guard/customer-guard";
import { CustomerEntity, TwitterQuestEntity } from "../../entities";
import {
  TwitterQuestStatus,
  TwitterQuestType,
} from "../../config/game-interface";
import { sequelize } from "../../database";
import { Transaction } from "sequelize";

export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/claim-twitter-quest",
    schema: {
      body: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
    },
    preHandler: [customerGuard],
    handler: async function (request: any) {
      const customerInfo = await CustomerEntity.findByPk(request.user.id);
      if (!customerInfo) {
        throw new Error("customer_not_found");
      }
      const { id } = request.body;
      const questInfo = await TwitterQuestEntity.findByPk(id);
      if (!questInfo) {
        throw new Error("quest_not_found");
      }
      if (questInfo.customer_id != customerInfo.id) {
        throw new Error("invalid_quest");
      }
      if (questInfo.status == TwitterQuestStatus.Claimed) {
        throw new Error("invalid_quest_status");
      }
      // switch (questInfo.type) {
      //   case TwitterQuestType.Liked:
      //     break;
      //   case TwitterQuestType.Follow:
      //   case TwitterQuestType.Retweeted:
      //   case TwitterQuestType.Comment:
      //     const tweetQuest = await requestTwitter.getTweetDataById(
      //       request.twitterToken,
      //       request.twitterSecret,
      //       twitter_quest_id
      //     );
      //     if (!tweetQuest) {
      //       throw new Error("tweet_not_found");
      //     }
      //     questInfos.push(
      //       new TwitterQuestEntity({
      //         customer_id: customerInfo.id,
      //         type,
      //         twitter_quest_id,
      //       })
      //     );
      //     console.log(tweetQuest);
      // }
      // await sequelize.transaction(async (t: Transaction) => {
      //   questInfos.map((questInfo) => questInfo.save({ transaction: t }));
      // });
      // return { customerInfo, questInfos };
    },
  });
}
