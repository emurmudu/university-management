import { AcademicSemesterRoutes } from './../modules/academicSemester/academicSemesterRoute';
import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { StudentRoutes } from '../modules/student/student.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

// router.use('/users', UserRoutes);
// router.use('/students', StudentRoutes);

export default router;
