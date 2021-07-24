import mongoose from 'mongoose';
const TransactionData = new mongoose.Schema(
  {
    stashId: String,
    network: String,
    alreadyBonded: Number,
    stake: Number,
    collectionAddress: String,
    commissionRatio: Number,
    yieldscanCommission: Number,
    transactionHash: String,
    successful: Boolean,
  },
  { timestamps: true },
);
export default TransactionData;
