import mongoose from 'mongoose';
import config from '../../config';
// import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.util';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

// const createStudentIntoDB = async (password: string, payload: TStudent) => {
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction()
    userData.id = await generateStudentId(admissionSemester);

    //create a user(transaction-1)
    const newUser = await User.create([userData], {session});
  
    // create a student
    if (!newUser.length){
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user')
    } 

      // set id, _id as user
      payload.id = newUser[0].id;
      payload.user = newUser[0]._id; // referrence id
  
      // create a student(transaction-2)
      const newStudent = await StudentModel.create([payload], {session});
      if(!newStudent.length){
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student')
      }

      await session.commitTransaction();
      await session.endSession()
      return newStudent;
    
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST,'Failed to create student')
  }
}
 

export const UserServices = {
  createStudentIntoDB,
}
