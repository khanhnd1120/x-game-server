import { Model, Table, Column, DataType } from "sequelize-typescript";
@Table({
  tableName: "password",
  version: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export default class PasswordEntity extends Model {
  @Column({ type: DataType.INTEGER })
  user_id: string;
  @Column({ type: DataType.STRING })
  hash: string;
}
