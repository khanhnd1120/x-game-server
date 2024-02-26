"use strict";
import * as fastify from "fastify";
import requestTwitter from "../../services/request-twitter";
import customerGuard from "../../guard/customer-guard";
export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/get-twitter-user-data",
    preHandler: customerGuard,
    handler: async function (request: any) {
      const data = await requestTwitter.getTwitterUserData(
        request.twitterToken,
        request.twitterSecret
      );
      return data
    },
  });
}
