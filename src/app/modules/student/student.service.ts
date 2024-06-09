import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';



const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // {email: {$regex : query.searchTerm, $options: i}}
  let searchTerm = '';
  if(query?.searchTerm){
    searchTerm = query?.searchTerm as string
  }
  const result = await StudentModel.find({
    $or:['email', 'name.firstName', 'presentAddress'].map((field) =>({
      [field]: {$regex: searchTerm, $options:'i'}
    }))
  })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};



const getSingleStudentFromDB = async (id: string) => {
  // const result = await StudentModel.findById(id) // for mongoose default id = _id
  const result = await StudentModel.findOne({ id }) // for custom generated id. if async use {id} instead {id:id}
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};


const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const {name, guardian, localGuardian, ...remainingStudentData} = payload;

  const modifiedUpdatedData : Record<string, unknown>={
    ...remainingStudentData
  }

  /*
    guardian : {
       fatherOccupation : "Teacher"
    }
    
    guardina.fatherOccupation = "Teacher"
    
   */
  if(name && Object.keys(name).length){
    for(const [key, value] of Object.entries(name)){
      modifiedUpdatedData [`name.${key}`] = value;
    }
  }

  if(guardian && Object.keys(guardian).length){
    for(const [key, value] of Object.entries(guardian)){
      modifiedUpdatedData [`guardian.${key}`] = value;
    }
  }

  if(localGuardian && Object.keys(localGuardian).length){
    for(const [key, value] of Object.entries(localGuardian)){
      modifiedUpdatedData [`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await StudentModel.findOneAndUpdate(
    { id }, 
    modifiedUpdatedData,
    {new:true, runValidators:true}
  );
  return result;
};



const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // const result = await StudentModel.findOne({ id });
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if(!deletedStudent){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete student')
    }

    const deletedUser = await User.findOneAndUpdate(
      {id},
      {isDeleted:true},
      {new:true, session}
    )
    if(!deletedUser){
      throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete user')
    }

    await session.commitTransaction();
    await session.endSession()
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete student')
  }
};



export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
