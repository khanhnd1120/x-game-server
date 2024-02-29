"use strict";
import * as fastify from "fastify";
import auth from "../../services/auth";
export default async function (app: fastify.FastifyInstance) {
  interface Input {
    user_name: string;
    password: string;
  }
  app.route({
    method: "POST",
    url: "/login",
    schema: {
      body: {
        type: "object",
        properties: {
          user_name: { type: "string" },
          password: { type: "string" },
          device_data: { type: "object" },
        },
        required: ["user_name", "password"],
      },
    },
    handler: async function (request: any, reply) {
      let input: Input = <Input>request.body;
      const authData = await auth.login(input.user_name, input.password);
      return authData;
    },
  });
}
