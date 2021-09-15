import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import cors from 'cors';

import config from '../../config';
import middlewares from '../middlewares';
const route = Router();
const whitelist = config?.allowedDomains;
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
// cors(corsOptions) // add this after '/:id/update',

export default (app: Router): void => {
  // Register our endpoint for this route-apis
  app.use('/:network/user', route);

  route.get('/:id', middlewares.userData);
  route.put(
    '/transaction/update',
    cors(corsOptions),
    celebrate({
      body: Joi.object({
        stashId: Joi.string(),
        network: Joi.string(),
        controllerId: Joi.string(),
        injectorId: Joi.string(),
        transactionType: Joi.string(),
        walletType: Joi.string(),
        ysFees: Joi.number(),
        ysFeesPaid: Joi.boolean(),
        alreadyBonded: Joi.number(),
        stake: Joi.number(),
        transactionHash: Joi.string(),
        successful: Joi.boolean(),
      }),
    }),
    middlewares.updateTransactionData,
  );
};
