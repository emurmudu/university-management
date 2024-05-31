import config from '../../config';
// import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.util';

// const createStudentIntoDB = async (password: string, payload: TStudent) => {
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  // const user : NewUser = {};
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  //or

  // if(!password){
  //     user.password= config.default_password as string;
  //   }else{
  //     user.password = password;
  //   }

  // set user role
  userData.role = 'student';

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  // set manually generated id
  // user.id = 2030100001;
  // userData.id ='2030100001';
  userData.id = await generateStudentId(admissionSemester);

  // const result = await User.create(studentData);

  //create a user
  // const result = await User.create(userData);
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // referrence id

    // create a student
    // const newStudent = await StudentModel.create(studentData);
    const newStudent = await StudentModel.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
