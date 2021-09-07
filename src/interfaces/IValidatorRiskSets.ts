import { IAccountIdentity } from './IAccountIdentity';

export interface IValidatorRiskSets {
  lowriskset: Array<{
    stashId: string;
    commission: number;
    totalStake: number;
    estimatedPoolReward: number;
    numOfNominators: number;
    rewardsPer100KSM: number;
    riskScore: number;
    oversubscribed: boolean;
    info: IAccountIdentity;
    ownStake: number;
    othersStake: number;
  }>;
  medriskset: Array<{
    stashId: string;
    commission: number;
    totalStake: number;
    estimatedPoolReward: number;
    numOfNominators: number;
    rewardsPer100KSM: number;
    riskScore: number;
    oversubscribed: boolean;
    info: IAccountIdentity;
    ownStake: number;
    othersStake: number;
  }>;
  highriskset: Array<{
    stashId: string;
    commission: number;
    totalStake: number;
    estimatedPoolReward: number;
    numOfNominators: number;
    rewardsPer100KSM: number;
    riskScore: number;
    oversubscribed: boolean;
    info: IAccountIdentity;
    ownStake: number;
    othersStake: number;
  }>;
}
