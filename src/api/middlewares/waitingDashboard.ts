import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IStakingInfo } from '../../interfaces/IStakingInfo';
import { getNetworkDetails, HttpError } from '../../services/utils';
import { isNil } from 'lodash';

const waitingDashboard = async (req, res, next) => {
  const Logger = Container.get('logger');
  const baseUrl = req.baseUrl;
  try {
    const networkDetails = getNetworkDetails(baseUrl);
    if (isNil(networkDetails)) {
      Logger.error('🔥 No Data found: %o');
      throw new HttpError(404, 'Network Not found');
    }
    const Validators = Container.get(networkDetails.name + 'Validators') as mongoose.Model<
      IStakingInfo & mongoose.Document
    >;

    const sortedData = await Validators.aggregate([
      {
        $match: {
          isWaiting: true,
        },
      },
      {
        $lookup: {
          from: networkDetails.name + 'accountidentities',
          localField: 'stashId',
          foreignField: 'stashId',
          as: 'info',
        },
      },
      {
        $sort: {
          rewardsPer100KSM: -1,
        },
      },
    ]);

    if (sortedData.length == 0) {
      Logger.error('🔥 No Data found: %o');
      throw new HttpError(404, 'No data found');
    }

    sortedData.map((x) => {
      x.commission = x.commission / Math.pow(10, 7);
      x.totalStake = x.totalStake / Math.pow(10, networkDetails.decimalPlaces);
      x.ownStake = x.ownStake / Math.pow(10, networkDetails.decimalPlaces);
      x.othersStake = x.totalStake - x.ownStake;
      x.numOfNominators = x.nominators.length;
      x.estimatedPoolReward = x.estimatedPoolReward / Math.pow(10, networkDetails.decimalPlaces);
      x.info = x.info[0] !== undefined ? x.info[0] : null;
    });

    const result = sortedData.map(
      ({
        stashId,
        commission,
        othersStake,
        ownStake,
        totalStake,
        estimatedPoolReward,
        numOfNominators,
        rewardsPer100KSM,
        riskScore,
        info,
      }) => ({
        stashId,
        commission,
        othersStake,
        ownStake,
        totalStake,
        estimatedPoolReward,
        numOfNominators,
        rewardsPer100KSM,
        riskScore,
        info,
      }),
    );

    res.json(result).status(200);
  } catch (e) {
    Logger.error('🔥 Error fetching validators data: %o', e);
    return next(e);
  }
};

export default waitingDashboard;
