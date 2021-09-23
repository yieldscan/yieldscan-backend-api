import { Container } from 'typedi';
import mongoose from 'mongoose';
import { ITransactionData } from '../../interfaces/ITransactionData';

const updateFeesPaidStatus = async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const data = req.body;
    const { ysFeesPaid, network, transactionHash } = data;

    const TransactionData = Container.get(network + 'TransactionData') as mongoose.Model<
      ITransactionData & mongoose.Document
    >;

    await TransactionData.findOneAndUpdate(
      { transactionHash: transactionHash },
      {
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
