import { ERROR_CODE, StatusCode } from '../enums/error';
import { IErrorDetails, IErrorList } from '../interfaces/error';

export const JoiValidationErrors = {
  required: ERROR_CODE.INVALID_MANDATORY_FIELDS
};

export const ErrorList: IErrorList = {
  [ERROR_CODE.NOT_FOUND]: {
    statusCode: StatusCode.NOT_FOUND,
    message: 'Not found'
  },
  [ERROR_CODE.INVALID_REQUEST]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Invalid request'
  },
  [ERROR_CODE.UNEXPECTED_ERROR]: {
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: 'We caught unexpected error'
  },
  [ERROR_CODE.INCORRECT_FIELD]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Incorrect field'
  },
  [ERROR_CODE.INTERNAL_SERVER_ERROR]: {
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: 'Incorrect field'
  },
  [ERROR_CODE.EMAIL_EXISTS]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Email was existed'
  },
  [ERROR_CODE.PHONE_NUMBER_EXISTS]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Phone number was existed'
  },
  [ERROR_CODE.SIGNATURE_VALIDATION_EXISTS]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Signature was existed'
  },
  [ERROR_CODE.INVALID_MANDATORY_FIELDS]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Invalid the mandatory fields'
  },
  [ERROR_CODE.UNAUTHORIZED]: {
    statusCode: StatusCode.UNAUTHORIZED,
    message: 'UNAUTHORIZED'
  },
  [ERROR_CODE.USER_EXISTED]: {
    statusCode: StatusCode.BAD_REQUEST,
    message: 'Invalid request'
  }
};

export class AppError extends Error {
  public errorCode: ERROR_CODE;
  errors?: IErrorDetails[];
  constructor(errorCode: ERROR_CODE, errors?: IErrorDetails[]) {
    super(errorCode);
    this.errorCode = errorCode;
    this.name = AppError.name;
    this.errors = errors;
  }

  getErrors() {
    const error = ErrorList[this.errorCode];
    return {
      errors: this.errors,
      statusCode: error.statusCode,
      message: error.message
    };
  }
}
