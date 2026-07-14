import express from 'express';
import {
  enrollInCourse,
  getMyCourses,
  getAllEnrollments
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', enrollInCourse);
router.get('/my-courses', getMyCourses);
router.get('/', authorize('admin'), getAllEnrollments);

export default router;
