export const Environment = {
  RABBITMQ_HOST: process.env.RABBITMQ_HOST,
  IS_WORKER: process.env.IS_WORKER === "1",
  JWT_SECRET: process.env.JWT_SECRET,
};
