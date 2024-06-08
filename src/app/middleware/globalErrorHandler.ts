
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource, TErrorSources } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';



  let errorSources : TErrorSources= [{
    path: '',
    message: 'Something went wrong'
  }]

  // if(err instanceof ZodError){
  //   statusCode:400;
  //   message: 'ami zod error'
  // }


 
  if(err instanceof ZodError){
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
    
  }else if (err?.name === 'ValidationError'){
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // err,
    stack : config.NODE_ENV === 'development' ? err?.stack : null,
 
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
