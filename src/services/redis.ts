import Redis from "ioredis";
const redis = new Redis(process.env.LOCAL_REDIS_CONNECT_URL);
export default redis;
