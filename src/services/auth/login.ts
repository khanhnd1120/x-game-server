import { RoleEntity, UserEntity } from "../../entities";
import checkPassword from "../password/check-password";
import generateAdminToken from "../user/generate-admin-token";
export default async function login(
  user_name: string,
  password: string
): Promise<any> {
  let userInfo: UserEntity = await UserEntity.findOne({
    where: { user_name: user_name },
  });

  if (!userInfo) {
    throw new Error("invalid_username_password");
  }
  if (userInfo.is_block) {
    throw new Error("user_is_blocked");
  }
  await checkPassword(userInfo.id, password);
  let token = await generateAdminToken(userInfo);
  let roleInfo = RoleEntity.getById(userInfo.role);
  userInfo.permissions = roleInfo.permissions;
  return { userInfo, token };
}
