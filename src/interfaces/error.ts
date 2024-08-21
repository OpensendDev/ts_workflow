import { StatusCode } from '../enums/error';

export interface IErrorDetails {
  message: string;
  key: string;
  code: string;
}

export interface IError<ErrorEnumType> {
  code: ErrorEnumType | string;
  message: string;
  details?: IErrorDetails[];
}

interface IErrorItem {
  statusCode: StatusCode;
  message: string;
}

export interface IErrorList {
  [key: string]: IErrorItem;
}
