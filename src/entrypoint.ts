/**
 * Required External Modules
 */
import path from "path";
require("dotenv").config();
import Fastify from "fastify";
// @ts-ignore
import AutoLoad from "fastify-autoload";
// @ts-ignore
import FastifyStatic from "fastify-static";
import errorHandler from "./hooks/error-handler";
import { ApiConfig } from "./config";
import fastifySocket from "fastify-socket.io";
import db from "./database";
import onSend from "./hooks/on-send";
import preValidation from "./hooks/pre-validation";
import cronjob from "./cronjob";
import test from "./test";

//@ts-ignore
import { fastifyRequestContextPlugin } from "fastify-request-context";
import bootstrap from "./services/bootstrap";
/**
 * App Variables
 */
if (!process.env.SERVICE_PORT) {
  process.exit(1);
}
/**
 * Server Activation
 */
db().then(async () => {
  await bootstrap();
  const fastifyAPI = Fastify();
  fastifyAPI.register(require("fastify-multipart"));
  fastifyAPI.register(require("fastify-compress"), { global: false });
  fastifyAPI.register(fastifyRequestContextPlugin, {});
  fastifyAPI.register(require("fastify-cors"), {
    // put your options here
  });
  fastifyAPI.register(require("fastify-formbody"));
  fastifyAPI.setErrorHandler(errorHandler);
  fastifyAPI.addHook("onSend", onSend);
  fastifyAPI.addHook("preValidation", preValidation);
  fastifyAPI.register(AutoLoad, {
    dir: path.join(__dirname, "/api"),
  });
  fastifyAPI.register(FastifyStatic, {
    root: ApiConfig.FOLDER.PUBLIC,
    prefix: "/public/", // optional: default '/'
  });
  fastifyAPI.register(fastifySocket, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  // fastify.register(FastifyStatic, {
  //   root: ApiConfig.FOLDER.TESTUI,
  //   prefix: "/testui/", // optional: default '/'
  // });
  fastifyAPI.addHook("preValidation", (req, reply, done) => {
    done();
  });
  console.log("fastify plugin loaded");
  fastifyAPI.listen(process.env.SERVICE_PORT, "0.0.0.0", (err, address) => {
    cronjob();
    test();
    if (err) {
      console.error("fastify error ", err);
      process.exit(1);
    }
    console.log(`game battle is listening at ${address}`);
  });
});
