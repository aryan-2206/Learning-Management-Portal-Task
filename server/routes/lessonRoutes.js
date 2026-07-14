import express from 'express';
import {
  getLessons,
  getLesson,
  addLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middleware/auth.js';

// mergeParams: true allows us to access courseId from the course router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getLessons)
  .post(protect, authorize('admin'), addLesson);

router
  .route('/:id')
  .get(getLesson)
  .put(protect, authorize('admin'), updateLesson)
  .delete(protect, authorize('admin'), deleteLesson);

export default router;
