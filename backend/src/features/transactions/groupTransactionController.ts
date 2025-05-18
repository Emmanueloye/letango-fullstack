import { Request, Response } from 'express';
import GroupTransaction from './groupTransactionModel';
import * as factory from '../../utils/handlerFactory';

export const getTransactions = factory.getAll({
  Model: GroupTransaction,
  label: 'transactions',
});
