import { Model, Table, Column, DataType, Unique } from "sequelize-typescript";
import { RewardEntity, TwitterQuestType } from "../config/game-interface";

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
  @Column({ type: DataType.INTEGER })
  point: number;
}
