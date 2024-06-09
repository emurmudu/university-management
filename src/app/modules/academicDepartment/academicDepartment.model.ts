import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


const academicDepartmentSchema = new Schema<TAcademicDepartment>({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    academicFaculty :{
        type: Schema.Types.ObjectId,
        ref: 'AcademicFaculty',
    }
},
{
    timestamps: true,
})

// same academic department name error handling
// academicDepartmentSchema.pre('save', async function(next){
//     const isDepartmentExists = await AcademicDepartment.findOne({
//         name : this.name,
//     })
//     if(isDepartmentExists){
//         throw new AppError(httpStatus.NOT_FOUND, 'This department is already exist')
//     }

//     next();

// })




// error handling when updating a deleted id/ null id
academicDepartmentSchema.pre('findOneAndUpdate', async function(next){

    const query = this.getQuery();

    const isDepartmentExists = await AcademicDepartment.findOne(query)

    if(!isDepartmentExists){
        throw new AppError(httpStatus.NOT_FOUND,'This department does not exist')
    }

    next();

})



export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)