import express from 'express';
import {
  markLessonComplete,
  getCourseProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', markLessonComplete);
router.get('/:courseId', getCourseProgress);

export default router;
