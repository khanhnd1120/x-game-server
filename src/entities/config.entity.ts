import { Model, Table, Column, DataType, Index } from "sequelize-typescript";
import { ConfigDataType, ConfigKey } from "../config/game-interface";
import schedule from "node-schedule";
import { cache } from "../services";
@Table({
  tableName: "config",
  version: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class ConfigEntity extends Model {
  @Index("name")
  @Column({ type: DataType.STRING })
  name: string;
  @Column({ type: DataType.TINYINT })
  type: ConfigDataType;
  @Column({ type: DataType.TEXT })
  value: string;
  @Column({ type: DataType.TEXT })
  description: string;
  static async refreshConfig() {
    let rs = await ConfigEntity.findAll();
    let obj: any = {};
    rs.forEach((c: ConfigEntity) => {
      switch (c.type) {
        case ConfigDataType.Boolean:
          obj[c.name] = c.value === "1";
          break;
        case ConfigDataType.Date:
          obj[c.name] = new Date(c.value);
          break;
        case ConfigDataType.Number:
          obj[c.name] = Number(c.value);
          break;
        case ConfigDataType.Object:
          try {
            obj[c.name] = JSON.parse(c.value);
          } catch (error) {}
          break;
        default:
          obj[c.name] = c.value;
      }
    });
    cache.set("all_config", obj, 0);
  }
  static async intervalRefresh() {
    ConfigEntity.refreshConfig();
    schedule.scheduleJob("*/5 * * * * *", function () {
      ConfigEntity.refreshConfig();
    });
  }
  static getConfig(name: ConfigKey) {
    let all: any = cache.get("all_config");
    if (all[name] === undefined) {
      throw new Error("config_not_found" + name);
    }
    return all[name];
  }
  static async validateConfig() {
    let allConfig: any = cache.get("all_config");
    let errors: string[] = [];
    for (var i in ConfigKey) {
      if (allConfig[i] === undefined) {
        errors.push(i);
      }
    }
    return errors;
  }

  static getPublicConfig() {
    let all: any = cache.get("all_config");
    let keys = Object.keys(all).filter((key) => key.includes("PUBLIC_CONFIG"));
    let obj: any = {};
    keys.forEach((key) => {
      obj[key] = all[key];
    });
    return obj;
  }
}
