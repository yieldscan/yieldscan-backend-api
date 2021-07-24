export interface ITransactionData {
  stashId: string;
  network: string;
  alreadyBonded: number;
  stake: number;
  collectionAddress: string;
  commissionRatio: number; 
  yieldscanCommission: number;
  transactionHash: string;
  successful: boolean;
}
