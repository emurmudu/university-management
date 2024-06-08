import { TErrorSource, TErrorSources } from './../interface/error';
import mongoose from "mongoose";


const handleValidationError = (err: mongoose.Error.ValidationError)=>{
    const errorSources : TErrorSources = Object.values(err.errors).map((val:mongoose.Error.ValidatorError | mongoose.Error.CastError) =>{
        return{
            path: val?.path,
            message: val?.message,
        }
    });

    type TGenericErrorResponse ={
        statusCode : number;
        message: string;
        errorSources : TErrorSources;

    }

    const statusCode = 400;
    return{
      statusCode,
      message:'validation error',
      errorSources,
    }
}

export default handleValidationError;