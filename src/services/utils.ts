import { CustomError } from 'ts-custom-error';
import mongoose from 'mongoose';
import { Container } from 'typedi';

import config from '../config';
import { IStakingInfo } from '../interfaces/IStakingInfo';
import { IAccountIdentity } from '../interfaces/IAccountIdentity';
import { isNil } from 'lodash';

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getLinkedValidators(networkName, socialInfo, stashId) {
  const parent = socialInfo?.parent;
  const AccountIdentity = Container.get(networkName + 'AccountIdentity') as mongoose.Model<
    IAccountIdentity & mongoose.Document
  >;
  const linkedValidators = isNil(parent)
    ? []
    : await AccountIdentity.aggregate([
        {
          $match: {
            parent: parent,
          },
        },
      ]);

  const result = linkedValidators.filter((el) => el.stashId != stashId);
  return result;
}

export function scaleData(val: number, max: number, min: number): number {
  return ((val - min) / (max - min)) * (100 - 1) + 1;
}

export function normalizeData(val: number, max: number, min: number): number {
  return (val - min) / (max - min);
}

export function getNetworkDetails(baseUrl: string): any {
  const networkUrl = baseUrl.substring(5, 8);
  const network = config.networks.find((x) => {
    if (x.name.includes(networkUrl)) {
      return x.name;
    }
  });
  return network;
}

export function sortLowRisk(arr: Array<IStakingInfo>, minRewardPerDay: number): Array<IStakingInfo> {
  const lowestRiskset = arr.filter(
    (x) =>
      x.riskScore < 0.3 &&
      x.commission !== 100 &&
      !x.oversubscribed &&
      !x.blocked &&
      x.rewardsPer100KSM > minRewardPerDay,
  );

  return lowestRiskset;
}

export function sortMedRisk(arr: Array<IStakingInfo>, minRewardPerDay: number): Array<IStakingInfo> {
  const medRiskSet = arr.filter(
    (x) =>
      x.riskScore < 0.5 &&
      x.commission !== 100 &&
      !x.oversubscribed &&
      !x.blocked &&
      x.rewardsPer100KSM > minRewardPerDay,
  );

  // Uncomment below if you want to include include suggestions from other risk-sets

  // const remaining = arr.filter((n) => !medRiskSet.includes(n));
  // const result = medRiskSet.concat(remaining);
  // return result;
  return medRiskSet;
}

export function sortHighRisk(arr: Array<IStakingInfo>, minRewardPerDay: number): Array<IStakingInfo> {
  const highRiskSet = arr.filter(
    (x) => x.commission !== 100 && !x.oversubscribed && !x.blocked && x.rewardsPer100KSM > minRewardPerDay,
  );

  return highRiskSet;
}

export function chunkArray(array: Array<unknown>, size: number): Array<unknown> {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

export class HttpError extends CustomError {
  public constructor(public code: number, message?: string) {
    super(message);
  }
}

export class NoDataFound extends Error {
  public name: string;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor); // after initialize properties
  }
}
