/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  type TErrorSource = {
    path: string | number;
    message: string;
  }[];

  const errorSources : TErrorSource = [{
    path: '',
    message: 'Something went wrong'
  }]

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // error: err,
  });
};

export default globalErrorHandler;

// error handling pattern
/*
success
message
errorSources:[
  path: '',
  message: '',
]
stack

*/
