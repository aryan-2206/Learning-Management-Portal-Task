import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import lessonRouter from './lessonRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:courseId/lessons', lessonRouter);

router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

export default router;
