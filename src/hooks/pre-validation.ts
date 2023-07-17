import { customEncrypt } from "../services";

export default async function preValidation(req: any, reply: any) {
  console.log(req.url);
  if (!req.body) {
    return;
  }
  let { __input } = req.body;
  if (__input) {
    let decrypted = customEncrypt.decrypt(
      __input,
      process.env.REQUEST_ENCRYPT_KEY
    );
    let data = JSON.parse(decrypted);
    req.body = data;
    req.isParseEncrypt = true;
  }
}
