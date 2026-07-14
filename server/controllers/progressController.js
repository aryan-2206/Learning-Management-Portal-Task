import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Mark lesson as complete
// @route   POST /api/progress
// @access  Private
export const markLessonComplete = asyncHandler(async (req, res, next) => {
  const { courseId, lessonId } = req.body;

  if (!courseId || !lessonId) {
    return next(new ErrorResponse('Please provide course ID and lesson ID', 400));
  }

  // Find progress record
  let progress = await Progress.findOne({
    studentId: req.user.id,
    courseId
  });

  if (!progress) {
    // If not enrolled/no progress record found, might need to handle, but they should enroll first
    return next(new ErrorResponse('Progress record not found. Are you enrolled?', 404));
  }

  // Check if already completed
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);

    // Calculate new percentage
    const totalLessons = await Lesson.countDocuments({ courseId });
    if (totalLessons > 0) {
      progress.percentageCompleted = Math.round((progress.completedLessons.length / totalLessons) * 100);
    }
    
    await progress.save();
  }

  res.status(200).json({
    success: true,
    data: progress
  });
});

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
export const getCourseProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOne({
    studentId: req.user.id,
    courseId: req.params.courseId
  });

  if (!progress) {
    return next(new ErrorResponse('No progress record found for this course', 404));
  }

  res.status(200).json({
    success: true,
    data: progress
  });
});
