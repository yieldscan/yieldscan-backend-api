import { Container } from 'typedi';
import mongoose from 'mongoose';
import { getNetworkDetails, HttpError } from '../../services/utils';
import { IValidatorHistory } from '../../interfaces/IValidatorHistory';
import { isNil } from 'lodash';

const lastEraIndex = async (req, res, next) => {
  const Logger = Container.get('logger');
  const baseUrl = req.baseUrl;
  try {
    const networkDetails = getNetworkDetails(baseUrl);
    if (isNil(networkDetails)) {
      Logger.error('🔥 No Data found: %o');
      throw new HttpError(404, 'Network Not found');
    }
    const era = parseInt(req.params.era);
    const ValidatorHistory = Container.get(networkDetails.name + 'ValidatorHistory') as mongoose.Model<
      IValidatorHistory & mongoose.Document
    >;

    const data = await ValidatorHistory.aggregate([
      {
        $sort: {
          eraIndex: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (data.length == 0) {
      Logger.error('🔥 No historic data found: %o');
      throw new HttpError(404, 'No user data found');
    }

    const result = {
      eraIndex: data[0].eraIndex,
    };

    return res.json(result).status(200);
  } catch (e) {
    Logger.error('🔥 Error generating user data: %o', e);
    return next(e);
  }
};

export default lastEraIndex;
