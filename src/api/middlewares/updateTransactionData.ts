import { Container } from 'typedi';
import mongoose from 'mongoose';
import { ITransactionData } from '../../interfaces/ITransactionData';

const updateTransactionData = async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const data = req.body;
    console.log(data);
    const { 
      stashId, 
      network, 
      alreadyBonded, 
      stake, 
      collectionAddress,
			commissionRatio, 
			yieldscanCommission,
      transactionHash, 
      successful 
    } = data;

    const TransactionData = Container.get(network + 'TransactionData') as mongoose.Model<
      ITransactionData & mongoose.Document
    >;

    await TransactionData.insertMany([
      {
        stashId: stashId,
        network: network,
        alreadyBonded: alreadyBonded,
        stake: stake,
        collectionAddress: collectionAddress,
			  commissionRatio: commissionRatio, 
			  yieldscanCommission: yieldscanCommission,
        transactionHash: transactionHash,
        successful: successful,
      },
    ]);
    return res.status(200).json({ status: 200, message: 'transaction info updated' });
  } catch (e) {
    Logger.error('🔥 Error while saving transaction data: %o', e);
    return next(e);
  }
};

export default updateTransactionData;
