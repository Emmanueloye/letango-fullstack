import multer, { FileFilterCallback } from 'multer';
import DataURIParser from 'datauri/parser';
import AppError from '../errors';
import { Request } from 'express';

// Store image in memory
const storage = multer.memoryStorage();

// To filter out none image files.
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError.BadRequest('photo field accepts only image.'));
  }
};

// Used in uploading the file
export const upload = multer({
  storage,
  fileFilter,
});

export const formatImageURI = (ext: string, buffer: Buffer) => {
  const datauri = new DataURIParser();
  return datauri.format(ext, buffer).content;
};
