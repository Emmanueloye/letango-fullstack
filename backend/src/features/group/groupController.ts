import Group from './groupModel';
import AppError from '../../errors';
import * as factory from '../../utils/handlerFactory';
import { v2 as cloudinary } from 'cloudinary';
import * as utils from '../../utils';

export const uploadImage = utils.upload.single('groupLogo');

export const createGroup = factory.createOne({
  Model: Group,
  label: 'group',
  excludedFields: ['approvalAuthorities'],
});

export const processImage = () => {};
