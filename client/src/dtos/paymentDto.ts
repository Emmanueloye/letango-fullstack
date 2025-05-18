export type IPayment = {
  contribution: number;
  transactionRef: string;
  description: string;
  createdAt: Date;
};

export type GroupTransaction = {
  _id: string;
  groupRef: string;
  from: string;
  to: string;
  fromId: {
    surname?: string;
    otherNames?: string;
    groupName?: string;
  };
  toId: {
    surname?: string;
    otherNames?: string;
    groupName?: string;
  };
  transactionRef: string;
  contribution: number;
  bank?: string;
  channel?: string;
  transactionId?: number;
  description: string;
  head?: string;
  headType?: string;
  transactionType: string;
  fee?: number;
  createdAt: Date;
};
