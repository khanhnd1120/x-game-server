import {
 RabbitMqQueueName,
 RPCAction,
 WorkerAction,
} from "../config/game-interface";
import client, { Channel, Connection } from "amqplib";
import crypt from "./crypt";
import { Environment } from "../config/environment";
import handleRPC from "./rpc/handle-rpc";
import dayjs from "dayjs";
import uploadFile from "./upload-file";
import processWorkerMessage from "./rpc/process-worker-message";
let rpcCache: { [key: string]: Function } = {};
let rpcTime: { [key: string]: number } = {};
const RPC_EXCHANGE = "BATTLE_RPC_EXCHANGE";
const RPC_QUEUE = "BATTLE_RPC_QUEUE";
const WORKER_BATTLE_QUEUE = "WORKER_BATTLE_QUEUE";
const BATTLE_UPLOAD_GAME_FILE_QUEUE = "BATTLE_UPLOAD_GAME_FILE_QUEUE";
let rabbitmq: any = null;
let channel: Channel = null;
let rpcResponseQueue: any = null;
let operatorResponseQueue: any = null;

export interface RPCPayload {
 action: RPCAction;
 input: any;
}
export interface WorkerPayload {
 action: WorkerAction;
 input: any;
}
async function callRPC(action: RPCAction, input: any): Promise<any> {
 console.log("call rpc ", RPCAction[action]);
 return new Promise((resolve, reject) => {
  let correlationId = crypt.uid();
  setTimeout(() => {
   console.log(`rabbitrpc reject `, { action, input, correlationId });
   delete rpcCache[correlationId];
   reject(null);
  }, 50000);
  rpcTime[correlationId] = new Date().getTime();
  rpcCache[correlationId] = function (payload: any) {
   resolve(payload);
  };
  let data = { action, input };
  channel.publish(RPC_EXCHANGE, "", Buffer.from(JSON.stringify(data)), {
   replyTo: rpcResponseQueue.queue,
   correlationId,
  });
 });
}
async function handleRPCMessage(msg: client.ConsumeMessage) {
 try {
  let input: RPCPayload = JSON.parse(msg.content.toString());
  let response: any = await handleRPC(input);
  channel.sendToQueue(
   msg.properties.replyTo,
   Buffer.from(JSON.stringify(response)),
   { correlationId: msg.properties.correlationId }
  );
  channel.ack(msg);
 } catch (error) {
  console.error(error);
 }
}
async function handleRPCResponse(msg: client.ConsumeMessage) {
 console.log(
  `rabbitonresponse ${msg.properties.correlationId} `,
  new Date().getTime() - rpcTime[msg.properties.correlationId]
 );
 let cb: Function = rpcCache[msg.properties.correlationId];
 if (cb) {
  cb(JSON.parse(msg.content.toString()));
 }
}
//WORKER
async function callWorker(action: WorkerAction, input: any): Promise<any> {
 console.log("callworker ", WorkerAction[action]);
 return new Promise((resolve, reject) => {
  let correlationId = crypt.uid();
  setTimeout(() => {
   if (rpcCache[correlationId]) {
    console.log(`workerreject `, { action, correlationId });
    delete rpcCache[correlationId];
    reject(null);
   }
  }, 50000);
  rpcTime[correlationId] = new Date().getTime();
  rpcCache[correlationId] = function (payload: any) {
   resolve(payload);
  };
  let data = { action, input };
  channel.sendToQueue(WORKER_BATTLE_QUEUE, Buffer.from(JSON.stringify(data)), {
   replyTo: operatorResponseQueue.queue,
   correlationId,
  });
 });
}
async function handleWorkerMessage(msg: client.ConsumeMessage) {
 try {
  console.log("handle worker job");
  let input: WorkerPayload = JSON.parse(msg.content.toString());
  let response: any = await processWorkerMessage(input);
  channel.sendToQueue(
   msg.properties.replyTo,
   Buffer.from(JSON.stringify(response)),
   { correlationId: msg.properties.correlationId }
  );
 } catch (error) {
  console.error(error);
 } finally {
  channel.ack(msg);
 }
}
async function handleWorkerResponse(msg: client.ConsumeMessage) {
 let cb: Function = rpcCache[msg.properties.correlationId];
 if (cb) {
  cb(JSON.parse(msg.content.toString()));
  delete rpcCache[msg.properties.correlationId];
  delete rpcTime[msg.properties.correlationId];
 } else {
  console.log(
   `workerresponse ${msg.properties.correlationId} `,
   new Date().getTime() - rpcTime[msg.properties.correlationId]
  );
  delete rpcTime[msg.properties.correlationId];
 }
}
//END WORKER

//UPLOADER
async function handleUploadMessage(msg: client.ConsumeMessage) {
 try {
  let data = JSON.parse(msg.content.toString());
  await uploadFile(data.filename, data.content);
  channel.ack(msg);
 } catch (error) {
  channel.nack(msg);
  console.error(error);
 }
}
async function uploadGame(filename: string, content: string) {
 console.log("upload game ", filename);
 channel.sendToQueue(
  BATTLE_UPLOAD_GAME_FILE_QUEUE,
  Buffer.from(JSON.stringify({ filename, content }))
 );
}
//END UPLOADER
async function connect() {
 const connection: Connection = await client.connect(Environment.RABBITMQ_HOST);
 console.log("RabbitMQ connected!");
 channel = await connection.createChannel();
 channel.on("close", function connectionClose() {
  rabbitmq = null;
  init();
 });
 await channel.assertQueue(RabbitMqQueueName.ANALYTICS_MQ_QUEUE, {
  durable: true,
 });
 await channel.assertExchange(RPC_EXCHANGE, "fanout", { durable: false });
 await channel.assertQueue(WORKER_BATTLE_QUEUE, { durable: false });
 if (Environment.IS_WORKER) {
  console.log("Connect rabbit as a worker");
  let rpcQueue = await channel.assertQueue("", {
   durable: false,
   exclusive: true,
  });
  channel.bindQueue(rpcQueue.queue, RPC_EXCHANGE, "");
  channel.consume(rpcQueue.queue, handleRPCMessage);
  channel.consume(WORKER_BATTLE_QUEUE, handleWorkerMessage);
  channel.prefetch(100);
 } else {
  console.log("connect rabbit as producer");
  rpcResponseQueue = await channel.assertQueue("", {
   durable: false,
   exclusive: true,
  });
  channel.consume(rpcResponseQueue.queue, handleRPCResponse, { noAck: true });
  operatorResponseQueue = await channel.assertQueue("", {
   durable: false,
   exclusive: true,
  });
  channel.consume(operatorResponseQueue.queue, handleWorkerResponse, {
   noAck: true,
  });
  await channel.assertQueue(BATTLE_UPLOAD_GAME_FILE_QUEUE, {
   durable: true,
  });
  channel.consume(BATTLE_UPLOAD_GAME_FILE_QUEUE, handleUploadMessage, {
   noAck: false,
  });
 }
 return channel;
}
async function init() {
 console.log("init rabbitmq");
 try {
  if (!rabbitmq) rabbitmq = await connect();
  console.log("RabbitMq connected!");
 } catch (error) {
  setTimeout(() => {
   console.log("retry");
   init();
  }, 5000);
  console.log("RabbitMQ connect failed. Retry in 5 seconds");
 }
}

async function sendMessage(queue: any, data: any) {
 try {
  if (!rabbitmq) rabbitmq = await connect();
  rabbitmq.sendToQueue(queue, Buffer.from(data), {
   persistent: true,
  });
 } catch (error) {
  console.log(error);
 }
}

async function sendAnalyticsMessage(data: any) {
 console.log("send analytics message ", data.event_name);
 await sendMessage(RabbitMqQueueName.ANALYTICS_MQ_QUEUE, data);
}
const rabbit = {
 uploadGame,
 callWorker,
 callRPC,
 init,
 sendAnalyticsMessage,
};
export default rabbit;
