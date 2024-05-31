import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  // return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
  return lastStudent?.id ? lastStudent.id: undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  // console.log(await findLastStudentId());
  // first time 0000
  // const currentId = (await findLastStudentId()) || (0).toString();
  let currentId = (0).toString(); // 0000 bydefault
  const lastStudentId = await findLastStudentId();
  // 2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4,6); // to find semester code 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // to find year 2030
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if(lastStudentId && lastStudentSemesterCode === currentSemesterCode && lastStudentYear === currentYear){
    currentId = lastStudentId.substring(6) // 0001

  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};
