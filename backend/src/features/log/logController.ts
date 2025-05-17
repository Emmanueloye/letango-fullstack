import { ClientSession, Types } from 'mongoose';
import Log from './logModel';

type IAuditLog = {
  requester: Types.ObjectId;
  action: string;
  change: string;
  targetGroup?: Types.ObjectId;
  targetUser?: Types.ObjectId;
  session?: ClientSession;
};
export const auditLog = async ({
  requester,
  action,
  change,
  targetGroup,
  targetUser,
  session = undefined,
}: IAuditLog) => {
  await Log.create(
    [
      {
        requester,
        action,
        change,
        targetGroup,
        targetUser,
      },
    ],
    { session }
  );
};
