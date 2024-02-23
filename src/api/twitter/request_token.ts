"use strict";
import * as fastify from "fastify";
import requestTwitter from "../../services/request-twitter";
export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/request_token",
    handler: async function (request: any) {
      const tokenData = await requestTwitter.requestTwitterToken();
      return {
        tokenData,
      };
    },
  });
}
