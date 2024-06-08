import { ZodError, ZodIssue } from "zod";
import { TErrorSource, TErrorSources } from "../interface/error";


const handleZodError = (err: ZodError)=>{

    const errorSources : TErrorSources = err.issues.map((issue: ZodIssue)=>{
      return{
        path: issue?.path[issue.path.length - 1],
        message: issue.message
      }
    })
    const statusCode = 400;
    return{
      statusCode,
      message:'Zod validation error',
      errorSources,
    }
  }

  export default handleZodError;