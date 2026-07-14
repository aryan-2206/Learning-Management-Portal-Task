import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a lesson title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  videoURL: {
    type: String,
    required: [true, 'Please add a video URL']
  },
  order: {
    type: Number,
    required: [true, 'Please specify the lesson order in the course']
  },
  duration: {
    type: String, // e.g., "15:30"
    required: [true, 'Please add video duration']
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  }
}, {
  timestamps: true
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
