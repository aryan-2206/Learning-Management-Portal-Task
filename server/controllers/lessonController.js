import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get lessons for a course
// @route   GET /api/courses/:courseId/lessons
// @access  Public
export const getLessons = asyncHandler(async (req, res, next) => {
  if (req.params.courseId) {
    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });
    return res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } else {
    // If we wanted to fetch all lessons across all courses
    const lessons = await Lesson.find();
    return res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  }
});

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
export const getLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id).populate({
    path: 'courseId',
    select: 'title'
  });

  if (!lesson) {
    return next(new ErrorResponse(`No lesson found with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lesson
  });
});

// @desc    Add lesson
// @route   POST /api/courses/:courseId/lessons
// @access  Private/Admin
export const addLesson = asyncHandler(async (req, res, next) => {
  req.body.courseId = req.params.courseId;

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(new ErrorResponse(`No course found with the id of ${req.params.courseId}`, 404));
  }

  const lesson = await Lesson.create(req.body);

  res.status(201).json({
    success: true,
    data: lesson
  });
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
export const updateLesson = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(new ErrorResponse(`No lesson found with the id of ${req.params.id}`, 404));
  }

  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: lesson
  });
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
export const deleteLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(new ErrorResponse(`No lesson found with the id of ${req.params.id}`, 404));
  }

  await lesson.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
