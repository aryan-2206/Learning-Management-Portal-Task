import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate enrollments
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
