import { Container } from 'typedi';
import mongoose from 'mongoose';
import { getNetworkDetails, HttpError } from '../../services/utils';
import { isNil } from 'lodash';
import { ITransactionData } from '../../interfaces/ITransactionData';

const existingUserCheck = async (req, res, next) => {
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

    const sortedData = await TransactionData.aggregate([
      // { $unwind: '$nominatorsInfo' },
      {
        $match: {
          $and: [{ stashId: stashId }, { createdAt: { $lt: new Date(new Date('2021-09-15').setHours(23, 59, 59)) } }],
        },
      },
      {
        $limit: 1,
      },
    ]);

    const result = { isExistingUser: false };

    if (sortedData.length == 0) {
      Logger.error('🔥 No Data found: %o');
    } else result.isExistingUser = true;

    return res.json(result).status(200);
  } catch (e) {
    Logger.error('🔥 Error generating risk-sets: %o', e);
    return next(e);
  }
};

export default existingUserCheck;
