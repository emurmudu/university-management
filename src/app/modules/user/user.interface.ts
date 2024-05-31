export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'block';
  isDeleted: boolean;
};

// export type NewUser = {
//   password: string;
//   role: string;
//   id: string;
// };

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;
