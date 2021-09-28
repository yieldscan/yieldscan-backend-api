import { Container } from 'typedi';
import mongoose from 'mongoose';
import { ITransactionData } from '../../interfaces/ITransactionData';

const updateTransactionData = async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const data = req.body;
    const {
      stashId,
      controllerId,
      injectorId,
      transactionType,
      sourcePage,
      walletType,
      ysFees,
      ysFeesAddress,
      ysFeesRatio,
      ysFeesPaid,
      network,
      alreadyBonded,
      stake,
      transactionHash,
      successful,
    } = data;

    const TransactionData = Container.get(network + 'TransactionData') as mongoose.Model<
      ITransactionData & mongoose.Document
    >;

    const transactionData = await TransactionData.findOneAndUpdate(
      { transactionHash: transactionHash },
      {
        stashId: stashId,
        network: network,
        controllerId: controllerId,
        injectorId: injectorId,
        transactionType: transactionType,
        sourcePage: sourcePage,
        walletType: walletType,
        ysFees: ysFees,
        ysFeesAddress: ysFeesAddress,
        ysFeesRatio: ysFeesRatio,
        ysFeesPaid: ysFeesPaid,
        alreadyBonded: alreadyBonded,
        stake: stake,
        transactionHash: transactionHash,
        successful: successful,
      },
      { upsert: true, useFindAndModify: false, new: true },
    );

    Logger.info('successfully added transaction data');
    Logger.info(JSON.stringify(transactionData, null, 2));

    return res.status(200).json({ status: 200, message: 'transaction info updated' });
  } catch (e) {
    Logger.error('🔥 Error while saving transaction data: %o', e);
    return next(e);
  }
};

export default updateTransactionData;
