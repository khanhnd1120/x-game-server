import { scheduleJob } from "node-schedule";
import { Model, Table, Column, DataType, Unique } from "sequelize-typescript";
import { cache } from "../services";

@Table({
  tableName: "role",
  version: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class RoleEntity extends Model {
  @Column({ type: DataType.STRING })
  name: string;
  @Column({ type: DataType.JSON })
  permissions: number[];
  public static async refresh() {
    let all = await RoleEntity.findAll();
    let obj: { [key: number]: RoleEntity } = {};
    all.forEach((r: RoleEntity) => {
      obj[r.id] = r;
    });
    cache.set("all_roles", obj, 0);
  }
  public static async runRefresh() {
    await RoleEntity.refresh();
    scheduleJob("*/5 * * * *", async () => {
      try {
        await RoleEntity.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  }
  public static getAlls() {
    return cache.get("all_roles");
  }
  public static getById(id: number) {
    let all: any = RoleEntity.getAlls();
    if (!all[id]) throw new Error("role_not_found");
    return all[id];
  }
}
