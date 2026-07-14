import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
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
  completedLessons: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson'
  }],
  percentageCompleted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// One progress record per student per course
progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
