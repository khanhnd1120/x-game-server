import { Model, Table } from "sequelize-typescript";
export { default as RoleEntity } from "./role.entity";
export { default as UserEntity } from "./user.entity";
export { default as PasswordEntity } from "./password.entity";

@Table({})
export default class UselessEntity extends Model {}
