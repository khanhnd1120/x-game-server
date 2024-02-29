import { RoleEntity } from "../entities";

export default async function bootstrap() {
  RoleEntity.runRefresh();
}
