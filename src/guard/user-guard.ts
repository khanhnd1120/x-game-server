import UserEntity from "../entities/user.entity";
import parseAdminToken from "../services/customer/parse-admin-token";
export default async function UserGuard(
  req: any,
  res: any,
  done: CallableFunction
) {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new Error("forbidden");
  }
  try {
    let token = auth.split(" ")[1];
    let { userInfo } = await parseAdminToken(token);
    req.user = <UserEntity>userInfo;
  } catch (error) {
    throw new Error("forbidden");
  }
}
