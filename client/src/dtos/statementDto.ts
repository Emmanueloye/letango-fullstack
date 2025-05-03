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
