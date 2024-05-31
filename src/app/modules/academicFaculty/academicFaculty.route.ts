import validateRequest from "../../middleware/validateRequest"
import { AcademicFacultyControllers } from "./academicFaculty.controller"
import { AcademicFacultyValidations } from "./academicFaculty.validation"
import express from 'express';

const router = express.Router()

router.post('/create-academic-faculty', validateRequest(AcademicFacultyValidations.createAcademicFacultyValidationSchema), AcademicFacultyControllers.createAcademicFaculty);


router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:facultyId', validateRequest(AcademicFacultyValidations.updateAcademicFacultyValidationSchema), AcademicFacultyControllers.updateAcademicFaculty);


router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);



export const AcademicFacultyRoutes = router;