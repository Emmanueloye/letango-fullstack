import { Request, Response } from 'express';
import statusCodes from '../errors/statusCodes';
import * as utils from '../utils';
import GetRequestAPI, { paginateDetails } from './getRequestAPI';
import AppError from '../errors';
import { auditLog } from '../features/log/logController';

type CreateOneParams = {
  Model: any;
  label: string;
  queryKey?: string;
  includedFields?: string[];
  excludedFields?: string[];
  log?: boolean;
};

type GetOneParams = {
  Model: any;
  label: string;
  queryKey?: string;
  paramKey?: string;
  populateOption?: { path: string; select?: string };
};

// To create document
export const createOne = ({
  Model,
  label,
  includedFields,
  excludedFields,
}: CreateOneParams) => {
  return async (req: Request, res: Response) => {
    // Restrict the body. This allows developers to specify either fields allowed or field to be excluded. One of these fields is required. If includedFields is specifed, no need to specified excluded fields.
    const filteredObj = utils.bodyFilter({
      req,
      includedFields,
      excludedFields,
    });

    // Create new document
    const newDoc = await Model.create(filteredObj);
    res.status(statusCodes.CREATED).json({
      status: 'success',
      [label]: newDoc,
      message: `${
        label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
      } created successfully.`,
    });
  };
};

// This Get all data relating to the query sent. You can also pass additional queries to the function by setting queryKeys and values. QueryKeys are the fields that will be queried and the values are the values that will be used to filter or query the fields.
export const getAll = ({
  Model,
  label,
  queryKeys,
  values,
}: {
  Model: any;
  label: string;
  queryKeys?: string[];
  values?: string[];
}) => {
  return async (req: Request, res: Response) => {
    let filterObj: any = {};

    if (queryKeys) {
      if (!values) {
        throw new AppError.BadRequest(
          'QueryKey and query properties must be specified.'
        );
      }
    }

    // This enable us to pass additional queries to the getAll function. Only specify the properties on database as the queryKeys and the name of the value(s) coming from the user as values.
    if (queryKeys && values) {
      queryKeys.map((el, i) => (filterObj[el] = req.query[values[i]]));
    }

    // Get requested data. Where querykeys and values are set and not available on the request, this query return an empty array.
    const getFeatures = new GetRequestAPI(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .limitDocuments()
      .paginate();

    const docs = await getFeatures.query;

    // To get the document count using the incoming query except for pagination and limit.
    const queryReq = new GetRequestAPI(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields();

    const documentCount = await queryReq.query.countDocuments();

    let page;
    if (req.query.page) page = paginateDetails(documentCount, req);
    res
      .status(statusCodes.OK)
      .json({ status: 'success', noHits: docs.length, page, [label]: docs });
  };
};

// GetOne function allows user to query for a single document. queryKey allows developers to modify the standard query by being specify with their query. paramKey allows you to switch between req.params and req.query
export const getOne = ({
  Model,
  label,
  queryKey,
  populateOption,
  paramKey,
}: GetOneParams) => {
  return async (req: Request, res: Response) => {
    let query;
    // To make the factory flexible to find by other criteria other than id.
    if (queryKey) {
      // Sometimes, value may be coming from req.query and not req.params. This make it ease to use the function for both. Specify paramKey to match the property of the incoming req.query. If not specified, then req.params.id will be used.
      const value = paramKey ? req.query[paramKey] : req.params.id;
      query = Model.findOne({ [queryKey]: value });
    } else {
      query = Model.findById(req.params.id);
    }

    if (populateOption) {
      query = query.populate(populateOption);
    }
    const doc = await query;

    if (!doc) {
      throw new AppError.NotFound(
        `We could not find ${label} resource you are looking for.`
      );
    }

    res.status(statusCodes.OK).json({ status: 'success', [label]: doc });
  };
};

// Ditto to createOne
export const updateOne = ({
  Model,
  label,
  queryKey,
  includedFields,
  excludedFields,
  log = false,
}: CreateOneParams) => {
  return async (req: Request, res: Response) => {
    const filteredObj = utils.bodyFilter({
      req,
      includedFields,
      excludedFields,
    });

    let doc;

    if (queryKey) {
      doc = await Model.findOneAndUpdate(
        { [queryKey]: req.params.id },
        filteredObj,
        { new: true, runValidators: true }
      );
    } else {
      doc = await Model.findByIdAndUpdate(req.params.id, filteredObj, {
        new: true,
        runValidators: true,
      });
    }

    if (!doc) {
      throw new AppError.NotFound(
        `We could not find ${label} resource you are looking for.`
      );
    }

    // If log is present, create an audit trail for such update.
    if (log) {
      const fields = Object.keys(filteredObj).filter(
        (key) => filteredObj[key] != null
      );
    }
    res.status(statusCodes.OK).json({
      status: 'success',
      message: `${
        label.charAt(0).toUpperCase() + label.slice(1)
      } updated successfully.`,
      [label]: doc,
    });
  };
};

// The function delete document.
export const deleteOne = ({ Model, label }: { Model: any; label: string }) => {
  return async (req: Request, res: Response) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      throw new AppError.NotFound(
        `We could not find the ${label} resource you are looking for.`
      );
    }
    await doc.deleteOne();
    res.status(statusCodes.OK).json({ status: 'success' });
  };
};
