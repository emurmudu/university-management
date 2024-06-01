import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';



const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
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


  const result = await StudentModel.findOneAndUpdate({ id }, payload);
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
  }
};



export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
