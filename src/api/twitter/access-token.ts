"use strict";
import * as fastify from "fastify";
import requestTwitter from "../../services/request-twitter";
import generateToken from "../../services/customer/generate-token";
export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/access-token",
    schema: {
      body: {
        type: "object",
        properties: {
          token: { type: "string" },
          verifier: { type: "string" },
          secret: { type: "string" },
        },
        required: ["token", "verifier", "secret"],
      },
    },
    handler: async function (request: any) {
      const { token, verifier, secret } = request.body;
      const tokenData = await requestTwitter.accessTwitterToken({
        token,
        verifier,
        secret,
      });
      const gameToken = await generateToken(
        tokenData.token,
        tokenData.secret,
        tokenData.customerInfo.id
      );
      return {
        gameToken,
        customerInfo: tokenData.customerInfo,
      };
    },
  });
}
