import { PasswordEntity } from "../../entities";
import crypt from "../crypt";
export default async function createPassword(
  customer_id: number,
  password: string
): Promise<PasswordEntity> {
  let hash = await crypt.hash(password);
  const passwordInfo: PasswordEntity = await PasswordEntity.create({
    customer_id,
    hash,
  });
  return passwordInfo;
}
