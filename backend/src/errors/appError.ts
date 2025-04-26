import StatusCodes from './statusCodes';

/**
 * Custom error class for handling bad request errors
 *
 * This class extends the built-in Error class to create a specific type of error for bad requests.
 *
 * it sets the statuscode, request status (fail/error), message and put flag of isoperation on handled errors
 *
 * Any error that is not handled by this class will be considered operational errors.
 *
 * @param: accept strings as input
 */
export class BadRequest extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BADREQUEST;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

/**
 * Custom error class for handling not found request errors
 *
 * This class extends the built-in Error class to create a specific type of error for not found requests.
 *
 * it sets the statuscode, request status (fail/error), message and put flag of isoperation on handled errors
 *
 * Any error that is not handled by this class will be considered operational errors.
 *
 * @param: accept strings as input
 */
export class NotFound extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOTFOUND;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

/**
 * Custom error class for handling unauthenticated request errors
 *
 * This class extends the built-in Error class to create a specific type of error for unauthenticated requests.
 *
 * it sets the statuscode, request status (fail/error), message and put flag of isoperation on handled errors
 *
 * Any error that is not handled by this class will be considered operational errors.
 *
 * @param: accept strings as input
 */
export class Unauthenticated extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

/**
 * Custom error class for handling unauthorized/forbidden request errors
 *
 * This class extends the built-in Error class to create a specific type of error for unauthorized/forbidden requests.
 *
 * it sets the statuscode, request status (fail/error), message and put flag of isoperation on handled errors
 *
 * Any error that is not handled by this class will be considered operational errors.
 *
 * @param: accept strings as input
 */
export class UnAuthorized extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

/**
 * Custom error class for handling too many/rate limiter request errors
 *
 * This class extends the built-in Error class to create a specific type of error for too many/rate limiter requests.
 *
 * it sets the statuscode, request status (fail/error), message and put flag of isoperation on handled errors
 *
 * Any error that is not handled by this class will be considered operational errors.
 *
 * @param: accept strings as input
 */
export class TooManyRequests extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.TO_MANY_REQUEST;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

/**
 * Custom error class for handling too many/rate limiter request errors
 *
 * This class extends the built-in Error class to create a specific type of error for too many/rate limiter requests.
 *
 * it sets the statuscode, request status (fail/error), message and put flag of isoperation on handled errors
 *
 * Any error that is not handled by this class will be considered operational errors.
 *
 * @param: accept strings as input
 */
export class InternalError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}
