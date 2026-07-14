import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Progress from '../models/Progress.js';

// @desc    Enroll in a course
// @route   POST /api/enroll
// @access  Private
export const enrollInCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;
  
  if (!courseId) {
    return next(new ErrorResponse('Please provide a course ID', 400));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse(`No course found with ID ${courseId}`, 404));
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    studentId: req.user.id,
    courseId
  });

  if (existingEnrollment) {
    return next(new ErrorResponse('You are already enrolled in this course', 400));
  }

  const enrollment = await Enrollment.create({
    studentId: req.user.id,
    courseId
  });

  // Initialize progress for this student and course
  await Progress.create({
    studentId: req.user.id,
    courseId,
    completedLessons: [],
    percentageCompleted: 0
  });

  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get enrolled courses for a student
// @route   GET /api/enroll/my-courses
// @access  Private
export const getMyCourses = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.find({ studentId: req.user.id })
    .populate({
      path: 'courseId',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    });

  // Attach progress to each course
  const myCourses = [];

  for (let enrollment of enrollments) {
    const progress = await Progress.findOne({
      studentId: req.user.id,
      courseId: enrollment.courseId._id
    });

    myCourses.push({
      ...enrollment.courseId._doc,
      enrolledDate: enrollment.enrolledDate,
      progress: progress ? progress.percentageCompleted : 0
    });
  }

  res.status(200).json({
    success: true,
    count: myCourses.length,
    data: myCourses
  });
});

// @desc    Get all enrollments (Admin)
// @route   GET /api/enroll
// @access  Private/Admin
export const getAllEnrollments = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.find()
    .populate({
      path: 'studentId',
      select: 'name email'
    })
    .populate({
      path: 'courseId',
      select: 'title'
    });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});
