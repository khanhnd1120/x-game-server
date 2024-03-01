import { ConfigEntity, RoleEntity } from "../entities";

export default async function bootstrap() {
  RoleEntity.runRefresh();
  ConfigEntity.intervalRefresh();
}
