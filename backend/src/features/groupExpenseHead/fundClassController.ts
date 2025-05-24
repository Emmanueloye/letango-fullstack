import { Request, Response } from 'express';
import * as factory from '../../utils/handlerFactory';
import * as utils from '../../utils';
import GetRequestAPI from '../../utils/getRequestAPI';
import FundClass from './FundClassificationModel';
import statusCodes from '../../errors/statusCodes';

export const getFundClass = factory.getAll({
  Model: FundClass,
  label: 'fundClasses',
  queryKeys: ['groupRef', 'headType', 'isActive'],
  values: ['groupRef', 'headType', 'isActive'],
});
