"use strict";
import * as fastify from "fastify";

export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "GET",
    url: "/",
    handler: async function (request: any, reply: any) {
      reply.send(new Date().getTime());
    },
  });
}
