export type StatementType = {
  _id: string;
  userRef: string;
  description: string;
  contribution: number;
  createdAt: Date;
  fromId: string;
  toId: string;
  from: string;
  to: string;
  transactionRef: string;
  transactionId: number;
  bank: string;
  channel: string;
  fee: number;
};

export type PersonalStatment = {
  status: string;
  openingBal: number;
  statement: StatementType[];
  noHits: number;
  date: { startDate: Date; endDate: Date };
};

export type TFlow = {
  _id: string;
  userRef: string;
  from: string;
  to: string;
  fromId: string;
  toId: string;
  transactionRef: string;
  contribution: number;
  bank?: string;
  channel?: string;
  transactionId: number;
  description: string;
  transactionType: string;
  fee?: number;
  createdAt: Date;
};

export type TransactionFlowType = {
  status: string;
  noHits: number;
  inflow?: TFlow[];
  outlflow?: TFlow[];
  path: string;
};
