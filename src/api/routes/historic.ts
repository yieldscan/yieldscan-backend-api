import { Router } from 'express';
import middlewares from '../middlewares';
const route = Router();

export default (app: Router): void => {
  // Register our endpoint for this route-apis
  app.use('/:network/historic', route);

  route.get('/lowest-nominator-stake/:era', middlewares.lowestNominatorStake);
  route.get('/last-era-index', middlewares.lastEraIndex);
};
