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

export type Withdrawal = {
  _id: string;
  groupRef: string;
  requester: string;
  from: string;
  to: string;
  fromGroup: string;
  contribution: number;
  bank: string;
  description: string;
  accountNumber: number;
  head: string;
  approvalStatus: string;
  approvedBySys: boolean;
  approvedBy: {
    userId: {
      _id: string;
      surname: string;
      otherNames: string;
    };
    approvedAt: Date;
    status: string;
    comment: string;
  }[];
  createdAt: Date;
};

export type Approval = {
  userId: {
    _id: string;
    surname: string;
    otherNames: string;
  };
  approvedAt?: Date;
  status: string;
  comment?: string;
};
