import { PasswordEntity } from "../../entities";
import crypt from "../crypt";
export default async function checkPassword(
  user_id: number,
  password: string
): Promise<void> {
  let passwordInfo: PasswordEntity = await PasswordEntity.findOne({
    where: { user_id },
  });
  if (!passwordInfo) {
    throw new Error("invalid_password");
  }
  await crypt.compare(password, passwordInfo.hash);
}
