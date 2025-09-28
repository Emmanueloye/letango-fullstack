import { Request, Response } from 'express';
import GroupSetting from './groupSettingModel';
import * as factory from '../../utils/handlerFactory';

// export const createGroupSettings = async (req: Request, res: Response) => {};
export const createGroupSettings = factory.createOne({
  Model: GroupSetting,
  label: 'groupSettings',
});

export const getGroupSettings = factory.getAll({
  Model: GroupSetting,
  label: 'groupSetting',
});

export const updateGroupSetting = factory.updateOne({
  Model: GroupSetting,
  label: 'groupSetting',
});
