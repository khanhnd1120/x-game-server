import {
  Model,
  Table,
  Column,
  DataType,
  Unique,
  Default,
} from "sequelize-typescript";
import {
  RewardEntity,
  TwitterQuestStatus,
  TwitterQuestType,
} from "../config/game-interface";

@Table({
  tableName: "twitter-quest",
  version: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class TwitterQuestEntity extends Model {
  @Column({ type: DataType.INTEGER })
  customer_id: number;
  @Column({ type: DataType.INTEGER })
  type: TwitterQuestType;
  @Column({ type: DataType.JSON })
  rewards: RewardEntity[];
  @Default(0)
  @Column({ type: DataType.INTEGER })
  status: TwitterQuestStatus;
  @Column({ type: DataType.BOOLEAN })
  is_claim: boolean;
  @Column({ type: DataType.STRING })
  twitter_quest_id: string;
}
