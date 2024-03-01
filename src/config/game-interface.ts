export enum RPCAction {}
export enum WorkerAction {}
export enum RabbitMqQueueName {
  ANALYTICS_MQ_QUEUE = "analytics_queue",
}
export enum ConfigKey {
  WHITE_LIST_X_ACCOUNT_SHOW_QUEST = "WHITE_LIST_X_ACCOUNT_SHOW_QUEST",
  SETTING_TWITTER_QUEST = "SETTING_TWITTER_QUEST",
}
export enum ConfigDataType {
  String,
  Number,
  Boolean,
  Date,
  Object,
}
export enum TwitterQuestType {
  Liked,
  Retweeted,
  Comment,
  Follow,
}
export enum TwitterQuestStatus {
  Created,
  Finished,
  Claimed
}
export enum RewardType {
  Point,
}
export interface RewardEntity {
  reward_type: RewardType;
  reward_quantity: number;
}
export interface TwitterQuestConfig {
  type: TwitterQuestType;
  rewards: RewardEntity[];
  rate: number;
}
