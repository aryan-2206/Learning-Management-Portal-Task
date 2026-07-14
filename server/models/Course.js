import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Development', 'Design', 'Business', 'Marketing', 'IT & Software', 'Personal Development']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop'
  },
  duration: {
    type: String,
    required: [true, 'Please add estimated duration (e.g., 10 hours)']
  },
  difficulty: {
    type: String,
    required: [true, 'Please add difficulty level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete lessons when a course is deleted
courseSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('Lesson').deleteMany({ courseId: this._id });
  next();
});

// Reverse populate with virtuals
courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false
});

courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
