import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Default,
  Unique,
  AfterUpdate,
} from "sequelize-typescript";
import { updateAdminInfo } from "../services/user";
@Table({
  tableName: "user",
  version: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class UserEntity extends Model {
  @Unique("user_name")
  @Column({ type: DataType.STRING })
  user_name: string;
  @Column({ type: DataType.TINYINT })
  role: number;
  @Column({ type: DataType.JSON })
  permissions: number[];
  @Column({ type: DataType.STRING })
  name: string;
  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  is_block: boolean;
  @AfterUpdate
  static async updateSession(instance: UserEntity) {
    await updateAdminInfo(instance);
  }
}
