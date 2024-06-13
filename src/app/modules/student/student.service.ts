import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // {email: {$regex : query.searchTerm, $options: i}}
  // done on query builder 
  // const queryObj = { ...query }; 
  
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQuery = StudentModel.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // // console.log({ query, queryObj });
  // console.log({ query}, {queryObj});

  // const result = await searchQuery.find(queryObj)
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });


  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let page = 1;
  // let skip = 0;
  // let limit = 1;
 
  // if(query.limit){
  //   limit = Number(query.limit);
  // }

  // if(query.page){
  //   page = Number(query.page);
  //   skip = (page-1)*limit
  // }
  // const paginateQuery = sortQuery.skip(skip);
  
  // const limitQuery = paginateQuery.limit(limit)

  // field limiting
  // let fields = '-__v'
//   if(query.fields){
//     fields = (query.fields as string).split(',').join(' ');
//     console.log({fields})
//   }
//   const fieldQuery = await limitQuery.select(fields);
//   return fieldQuery;

const studentQuery = new QueryBuilder(StudentModel.find()
.populate('admissionSemester')
.populate({
  path: 'academicDepartment',
  populate: {
    path: 'academicFaculty',
  },
}),query).search(studentSearchableFields).filter().sort().paginate().fields();

const result = await studentQuery.modelQuery;
return result;

};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await StudentModel.findById(id) // for mongoose default id = _id
  // const result = await StudentModel.findOne({ id }) // for custom generated id. if async use {id} instead {id:id}
  const result = await StudentModel.findById( id ) // for custom generated id. if async use {id} instead {id:id}
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
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await StudentModel.findByIdAndUpdate(
     id ,
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // const result = await StudentModel.findOne({ id });
    const deletedStudent = await StudentModel.findByIdAndUpdate(
       id ,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    // get user _id from deletedStudent
    const userId = deletedStudent.user;


    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
