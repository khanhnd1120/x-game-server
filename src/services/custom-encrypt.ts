import crypto from "crypto";
const IV_SIZE = 16;
function encrypt(plainText: string, keyString: string) {
  const iv = crypto.randomBytes(IV_SIZE);
  const cipher = crypto.createCipheriv("aes-256-cbc", keyString, iv);
  let cipherText = cipher.update(Buffer.from(plainText, "utf8"));
  cipherText = Buffer.concat([cipherText, cipher.final()]);
  const combinedData = Buffer.concat([iv, cipherText]);
  const combinedString = combinedData.toString("base64");
  return combinedString;
}

function decrypt(combinedString: string, keyString: string) {
  const combinedData = Buffer.from(combinedString, "base64");
  const iv = Buffer.alloc(IV_SIZE);
  const cipherText = Buffer.alloc(combinedData.length - iv.length);
  combinedData.copy(iv, 0, 0, iv.length);
  combinedData.copy(cipherText, 0, iv.length);
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyString, iv);
  //@ts-ignore
  let plainText = decipher.update(cipherText, "utf8");
  //@ts-ignore
  plainText += decipher.final("utf8");
  return plainText;
}
const customEncrypt = { encrypt, decrypt };
export default customEncrypt;
