"use strict";
import dayjs from "dayjs";
import * as fastify from "fastify";
import GameConstant from "../../config/game-constant";
import { ConfigKey } from "../../config/game-interface";
import { ConfigEntity } from "../../entities";
export default async function (app: fastify.FastifyInstance) {
  app.route({
    method: "POST",
    url: "/get-config",
    handler: async function (req: any) {
      req.customEncrypt = true;
      const endOfDay = new Date(dayjs().endOf("day").unix() * 1000);
      const now = new Date();
      let whiteListXAccountQuest = ConfigEntity.getConfig(
        ConfigKey.WHITE_LIST_X_ACCOUNT_SHOW_QUEST
      );
      const settingTwitterQuest = ConfigEntity.getConfig(
        ConfigKey.SETTING_TWITTER_QUEST
      );
      return {
        ...GameConstant,
        endOfDay,
        now,
        settingTwitterQuest,
        whiteListXAccountQuest,
      };
    },
  });
}
