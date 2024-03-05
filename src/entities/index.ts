import { Model, Table } from "sequelize-typescript";
export { default as RoleEntity } from "./role.entity";
export { default as UserEntity } from "./user.entity";
export { default as PasswordEntity } from "./password.entity";
export { default as ConfigEntity } from "./config.entity";
export { default as TwitterQuestEntity } from "./twitter-quest.entity";
export { default as CustomerEntity } from "./customer.entity";
export { default as NewbieQuestEntity } from "./newbie-quest.entity";

@Table({})
export default class UselessEntity extends Model {}
