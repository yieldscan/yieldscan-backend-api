import { Container } from 'typedi';
import mongoose from 'mongoose';
import { isNil } from 'lodash';

import { HttpError, getNetworkDetails } from '../../services/utils';
import { ICouncil } from '../../interfaces/ICouncil';

const councilMember = async (req, res, next) => {
  const Logger = Container.get('logger');
  const baseUrl = req.baseUrl;
  try {
    const networkDetails = getNetworkDetails(baseUrl);
    if (isNil(networkDetails)) {
      Logger.error('🔥 No Data found: %o');
      throw new HttpError(404, 'Network Not found');
    }
    const id = req.params.id;
    const Council = Container.get(networkDetails.name + 'Council') as mongoose.Model<ICouncil & mongoose.Document>;

    const data = await Council.aggregate([
      {
        $match: {
          accountId: id,
        },
      },
      {
        $lookup: {
          from: networkDetails.name + 'accountidentities',
          localField: 'accountId',
          foreignField: 'accountId',
          as: 'memberIdentity',
        },
      },
      {
        $lookup: {
          from: networkDetails.name + 'accountidentities',
          localField: 'backersInfo.backer',
          foreignField: 'stashId',
          as: 'backersIdentity',
        },
      },
      {
        $lookup: {
          from: networkDetails.name + 'councilidentities',
          localField: 'accountId',
          foreignField: 'accountId',
          as: 'additionalInfo',
        },
      },
    ]);

    if (data.length == 0) {
      Logger.error('🔥 No Data found: %o');
      throw new HttpError(404, 'No data found');
    }

    const result = data.map((x) => {
      const totalBalance = x.totalBalance / Math.pow(10, networkDetails.decimalPlaces);
      const backing = x.stake / Math.pow(10, networkDetails.decimalPlaces);
      const backersInfo = x.backersInfo.map((y) => {
        const stake = y.stake / Math.pow(10, networkDetails.decimalPlaces);
        const backerName = x.backersIdentity.filter((z) => z.accountId == y.backer);
        return {
          stake: stake,
          backer: y.backer,
          info: backerName[0] !== undefined ? backerName[0] : null,
        };
      });

      const additionalInfo =
        data[0].additionalInfo[0] !== undefined
          ? data[0].additionalInfo.map((x) => {
              return {
                vision: x.vision,
                // currently members not inludeded in council member profile
                // members: x.members.map((y) => {
                //   return {
                //     member: y.member,
                //     role: y.role !== undefined ? y.role : null,
                //     twitter: y.twitter !== undefined ? y.twitter : null,
                //   };
                // }),
              };
            })
          : [{}];

      const socialInfo = data[0].memberIdentity[0] !== undefined ? data[0].memberIdentity[0] : [{}];

      const transparencyScores =
        data[0].memberIdentity[0] !== undefined
          ? data[0].memberIdentity.map((x) => {
              const nameScore = x.display !== null ? 20 : 0;
              const emailScore = x.email !== null ? 50 : 0;
              const legalScore = x.legal !== null ? 100 : 0;
              const riotScore = x.riot !== null ? 50 : 0;
              const twitterScore = x.twitter !== null ? 40 : 0;
              const webScore = x.web !== null ? 70 : 0;
              const totalScore = nameScore + emailScore + legalScore + riotScore + twitterScore + webScore;
              return {
                name: nameScore,
                email: emailScore,
                legal: legalScore,
                riot: riotScore,
                twitter: twitterScore,
                web: webScore,
                total: totalScore !== 330 ? totalScore : 400,
              };
            })
          : [{}];

      return {
        accountId: x.accountId,
        backing: backing,
        totalBalance: totalBalance,
        isRunnersUp: x.isRunnersUp,
        backersInfo: backersInfo,
        additionalInfo: additionalInfo[0],
        socialInfo: socialInfo[0],
        transparencyScores: transparencyScores[0],
      };
    });

    return res.json(result[0]).status(200);
  } catch (e) {
    Logger.error('🔥 Error fetching council data: %o', e);
    return next(e);
  }
};

export default councilMember;
