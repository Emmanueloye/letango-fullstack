import Group from './groupModel';
import FundClass from '../groupExpenseHead/FundClassificationModel';
import Member from '../members/memberModel';
import AppError from '../../errors';
import * as factory from '../../utils/handlerFactory';
import * as utils from '../../utils';
import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import { auditLog } from '../log/logController';
import statusCodes from '../../errors/statusCodes';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = utils.upload.single('photo');

export const createGroup = async (req: Request, res: Response) => {
  // Initiate the session
  const session = await startSession();
  let changeMade = 'create group and creator added as member.';

  await session.withTransaction(async () => {
    // create new group
    const group = await Group.create(
      [
        {
          groupRef: `GP-${utils.generateUniqueId(8)}`.toUpperCase(),
          groupName: req.body.groupName,
          groupType: req.body.groupType,
          groupPurpose: req.body.groupPurpose,
          photo: req.body.photo,
          photoPublicId: req.body.photoPublicId,
          groupDescription: req.body.groupDescription,
          owner: req.user.id,
          groupCode: utils.generateUniqueId(10),
        },
      ],
      { session }
    );

    // Only create default expense and income head when it is not peer contribution.
    if (
      !['peer contribution', 'crowd funding'].includes(
        req.body.groupType.toLowerCase()
      )
    ) {
      // create default income and expense head
      const defaultIncomeHeads = [
        'annual subscription',
        'weekly dues',
        'monthly levy',
      ];

      const defaultExpenseHeads = ['events', 'salaries & wages', 'others'];

      // Save default income head
      for (const incomeHead of defaultIncomeHeads) {
        await FundClass.create(
          [
            {
              groupRef: group[0].groupRef,
              groupId: group[0]._id,
              head: incomeHead,
              headType: 'income',
            },
          ],
          { session }
        );
      }
      // Save default expense head
      for (const expenseHead of defaultExpenseHeads) {
        await FundClass.create(
          [
            {
              groupRef: group[0].groupRef,
              groupId: group[0]._id,
              head: expenseHead,
              headType: 'expense',
            },
          ],
          { session }
        );
      }

      changeMade =
        'create group, default group income and expense head and creator added as member.';
    }

    // create member
    await Member.create(
      [
        {
          memberId: req.user.id,
          groupId: group[0]._id,
          groupRef: group[0].groupRef,
          role: 'owner',
        },
      ],
      { session }
    );

    // Create audit log
    auditLog({
      requester: req.user.id,
      action: 'create',
      change: changeMade,
      targetGroup: group[0]._id,
    });
    res
      .status(statusCodes.CREATED)
      .json({ status: 'success', message: 'Group created successfully.' });
  });
};

export const updateGroup = factory.updateOne({
  Model: Group,
  label: 'group',
  queryKey: 'groupRef',
  excludedFields: ['groupBalance', 'approvalAuthorities', 'groupCode', 'owner'],
  log: true,
});

export const getGroup = async (req: Request, res: Response) => {
  // Get the current group
  const group = await Group.findOne({ groupRef: req.params.id });

  // Get the group with the incoming group reference and logged in user
  const member = await Member.findOne({
    groupRef: req.params.id,
    memberId: req.user.id,
  });

  //Check if the currently logged in user is a member of the group.
  if (!member) {
    throw new AppError.NotFound(
      'The group you are looking for is not available on the server.'
    );
  }
  res.status(statusCodes.OK).json({ status: 'success', group });
};

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the current logged in user since to upload image require user to login. At this point, user will have been on request object.
  const currentGroup = await Group.findOne({ groupRef: req.params.id });

  //   If no file on request, then break out of the middleware.
  if (!req.file) return next();

  //   Process the image with sharp. Convert to buffer and to be changed to uri later in the code. The reason being that some free version of servers don't provide file storage.

  const newFile = await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .toBuffer();

  // If user already have image, then we want to delete
  if (currentGroup?.photoPublicId) {
    await cloudinary.uploader.destroy(currentGroup.photoPublicId);
  }

  //   Convert the processed image from buffer to uri
  const file = utils.formatImageURI('jpeg', newFile);

  //   Upload file to cloudinary
  const result = await cloudinary.uploader.upload(file as string);

  //   Set the cloudinary url and the public image id on the request object.
  req.body.photo = result.secure_url;
  req.body.photoPublicId = result.public_id;

  //   Move on to the next middleware.
  next();
};
