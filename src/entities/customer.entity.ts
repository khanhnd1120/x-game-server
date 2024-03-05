import {
  Model,
  Table,
  Column,
  DataType,
  Unique,
  Default,
} from "sequelize-typescript";
import {
  CustomerResource,
  RewardEntity,
  TwitterQuestType,
} from "../config/game-interface";
import mathUtils from "../services/math-utils";

@Table({
  tableName: "customer",
  version: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class CustomerEntity extends Model {
  @Column({ type: DataType.STRING })
  twitter_id: string;
  @Column({ type: DataType.STRING })
  twitter_username: string;
  @Default(0)
  @Column({ type: DataType.INTEGER })
  point: number;

  public transact(type: CustomerResource, amt: number) {
    const amount = Number(amt);
    if (amount === null || isNaN(amount)) {
      throw new Error("invalid_amount");
    }
    let bal = 0;

    switch (type) {
      case CustomerResource.Point:
        bal = mathUtils.add(this.point, amount);
        if (bal < 0) {
          throw new Error("not_enough_elite_stone");
        }
        this.point = bal;
        break;
    }
  }
}
