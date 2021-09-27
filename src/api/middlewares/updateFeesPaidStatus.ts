import { Container } from 'typedi';
import mongoose from 'mongoose';
import { ITransactionData } from '../../interfaces/ITransactionData';

const updateFeesPaidStatus = async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const data = req.body;
    const { ysFees, ysFeesAddress, ysFeesRatio, ysFeesPaid, network, transactionHash } = data;

    const TransactionData = Container.get(network + 'TransactionData') as mongoose.Model<
      ITransactionData & mongoose.Document
    >;

    await TransactionData.findOneAndUpdate(
      { transactionHash: transactionHash },
      {
        ysFees: ysFees,
        ysFeesAddress: ysFeesAddress,
        ysFeesRatio: ysFeesRatio,
        ysFeesPaid: ysFeesPaid,
      },
      { upsert: false, useFindAndModify: false },
    );

    return res.status(200).json({ status: 200, message: 'transaction info updated' });
  } catch (e) {
    Logger.error('🔥 Error while saving trnasaction data: %o', e);
    return next(e);
  }
};

export default updateFeesPaidStatus;
