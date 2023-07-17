import AdmZip from "adm-zip";
import env from "../config/env";
var AWS = require("aws-sdk");
export default async function uploadFile(filename: string, content: string) {
 let start = new Date().getTime();
 var zip = new AdmZip();
 // add file directly
 zip.addFile("data.json", Buffer.from(content, "utf8"));
 AWS.config.update({
  accessKeyId: env.AwsKeyId,
  secretAccessKey: env.AwsSecret,
  region: "ap-southeast-1",
 });

 var uploadParams: any = {
  Bucket: env.S3Bucket,
  Key: filename,
  Body: zip.toBuffer(),
 };

 var s3 = new AWS.S3({ apiVersion: "2006-03-01" });
 await new Promise((resolve, reject) => {
  s3.upload(uploadParams, function (err: any, data: any) {
   if (err) {
    reject(err);
   }
   if (data) {
    resolve(data.Location);
   }
  });
 });
 console.log(`uploaded file ${filename} in ${new Date().getTime() - start}ms`);
}
