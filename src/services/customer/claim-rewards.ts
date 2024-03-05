import { Transaction } from "sequelize";
import {
  CustomerResource,
  RewardEntity,
  RewardType,
} from "../../config/game-interface";
import { CustomerEntity } from "../../entities";
import { sequelize } from "../../database";

export default async function claimReward({
  customerInfo,
  rewards,
  transaction,
}: {
  customerInfo: CustomerEntity;
  rewards: RewardEntity[];
  transaction?: Transaction;
}) {
  let ownTransaction: Transaction;
  if (!transaction) {
    ownTransaction = await sequelize.transaction();
  }
  rewards.map((reward) => {
    switch (reward.reward_type) {
      case RewardType.Point:
        customerInfo.transact(CustomerResource.Point, reward.reward_quantity);
        break;
    }
  });
  await customerInfo.save({ transaction: transaction || ownTransaction });
  return { customerInfo };
}
