import express, { Application } from "express";
import { flip, snakeCase } from "lodash";
import path from "path";
import fs from "fs";
export default function routes(app: Application) {
  function loadFolder(folder: string) {
    let fullFolder = path.join(__dirname, folder);
    fs.readdirSync(fullFolder).forEach((file: string) => {
      let fullPath = path.join(fullFolder, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        return loadFolder(path.join(folder, file));
      }
      if (path.extname(file) !== ".js" || fullPath === __filename) {
        return;
      }

      const router = express.Router();
      const routeModule = require(path.join(fullFolder, file));
      let apiPath = `/${folder}/${file.replace(".js", "")}`.replace(/\\/g, "/");
      const route = routeModule.config
        ? routeModule.config(router)
        : routeModule(router);
      app.use(apiPath, route);
    });
  }
  loadFolder("api");
}
