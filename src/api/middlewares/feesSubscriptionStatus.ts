import { Container } from 'typedi';
import mongoose from 'mongoose';
import { getNetworkDetails, HttpError } from '../../services/utils';
import { isNil } from 'lodash';
import { ITransactionData } from '../../interfaces/ITransactionData';

const feesSubscriptionStatus = async (req, res, next) => {
  const Logger = Container.get('logger');
  const baseUrl = req.baseUrl;
  try {
    const networkDetails = getNetworkDetails(baseUrl);
    const stashId = req.params.id;
    if (isNil(networkDetails)) {
      Logger.error('🔥 No Data found: %o');
      throw new HttpError(404, 'Network Not found');
    }
    const TransactionData = Container.get(networkDetails.name + 'TransactionData') as mongoose.Model<
      ITransactionData & mongoose.Document
    >;
    const currentDate = new Date(new Date().setHours(0, 0, 0));
    const lastAllowablePaymentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 27,
    );

    const sortedData = await TransactionData.aggregate([
      // { $unwind: '$nominatorsInfo' },
      {
        $match: {
          $and: [
            { stashId: stashId },
            { successful: true },
            { createdAt: { $gt: lastAllowablePaymentDate } },
            { ysFeesPaid: true },
            { transactionType: { $regex: 'nominate', $options: 'i' } },
          ],
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    const result = { subscriptionActive: false, lastTransactionInfo: null };

    if (sortedData.length == 0) {
      Logger.error('🔥 No Data found: %o');
    } else {
      result.subscriptionActive = true;
      result.lastTransactionInfo = sortedData[0];
    }

    return res.json(result).status(200);
  } catch (e) {
    Logger.error('🔥 Error generating risk-sets: %o', e);
    return next(e);
  }
};

export default feesSubscriptionStatus;
