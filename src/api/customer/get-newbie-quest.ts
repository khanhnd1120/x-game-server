"use strict";
import * as fastify from "fastify";
import customerGuard from "../../guard/customer-guard";
import { CustomerEntity, NewbieQuestEntity } from "../../entities";

export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/get-newbie-quest",
    preHandler: [customerGuard],
    handler: async function (request: any) {
      const customerInfo = await CustomerEntity.findByPk(request.user.id);
      if (!customerInfo) {
        throw new Error("customer_not_found");
      }
      const newbieQuestInfos = await NewbieQuestEntity.findAll({
        where: {
          customer_id: customerInfo.id,
        },
      });
      return { newbieQuestInfos };
    },
  });
}
