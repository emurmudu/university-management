import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";


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
academicDepartmentSchema.pre('save', async function(next){
    const isDepartmentExists = await AcademicDepartment.findOne({
        name : this.name,
    })
    if(isDepartmentExists){
        throw new Error('This department is already exist')
    }

    next();

})

// error handling when updating a deleted id/ null id
academicDepartmentSchema.pre('findOneAndUpdate', async function(next){

    const query = this.getQuery();

    const isDepartmentExists = await AcademicDepartment.findOne(query)

    if(!isDepartmentExists){
        throw new Error('This department does not exist')
    }

    next();

})



export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment', academicDepartmentSchema)