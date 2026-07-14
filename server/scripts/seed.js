import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import bcrypt from 'bcryptjs';

dotenv.config(); // loads server/.env when run from the server/ directory


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const coursesData = [
  {
    title: 'Modern React Bootcamp',
    description: 'Learn React from scratch with hooks, router, and state management.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    duration: '15 Hours',
    difficulty: 'Beginner'
  },
  {
    title: 'Advanced Node.js',
    description: 'Master Node.js, Express, MongoDB, and build scalable APIs.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop',
    duration: '20 Hours',
    difficulty: 'Advanced'
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Learn Figma, design systems, and modern UI principles.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
    duration: '12 Hours',
    difficulty: 'Intermediate'
  },
  {
    title: 'Digital Marketing 101',
    description: 'Grow your business with SEO, SEM, and social media marketing.',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000&auto=format&fit=crop',
    duration: '8 Hours',
    difficulty: 'Beginner'
  },
  {
    title: 'Fullstack Next.js',
    description: 'Build production-ready apps with Next.js 14, Tailwind, and Prisma.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    duration: '25 Hours',
    difficulty: 'Advanced'
  },
  {
    title: 'Business Strategy Basics',
    description: 'Learn how to build and scale a successful business.',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=1000&auto=format&fit=crop',
    duration: '10 Hours',
    difficulty: 'Beginner'
  },
  {
    title: 'Python Data Science',
    description: 'Learn pandas, numpy, and machine learning basics.',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    duration: '30 Hours',
    difficulty: 'Intermediate'
  },
  {
    title: 'Cloud Computing with AWS',
    description: 'Prepare for AWS Solutions Architect certification.',
    category: 'IT & Software',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    duration: '40 Hours',
    difficulty: 'Advanced'
  },
  {
    title: 'Personal Finance Mastery',
    description: 'Take control of your money and build wealth.',
    category: 'Personal Development',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop',
    duration: '6 Hours',
    difficulty: 'Beginner'
  },
  {
    title: 'Graphic Design with Illustrator',
    description: 'Create vector graphics, logos, and icons.',
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop',
    duration: '18 Hours',
    difficulty: 'Intermediate'
  }
];

const seedDB = async () => {
  await connectDB();

  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();

    console.log('Cleared existing data');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Save manually to avoid pre-save hook double hashing if we used create
    // Actually, User.create runs pre-save hooks, so we should just pass plain text password.
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@learnsphere.com',
      password: 'admin123', 
      role: 'admin'
    });

    console.log('Admin user created');

    // Create Courses
    const coursesWithInstructor = coursesData.map(course => ({
      ...course,
      instructor: adminUser._id
    }));

    const createdCourses = await Course.insertMany(coursesWithInstructor);
    console.log('Courses created');

    // Create Lessons
    const lessons = [];
    createdCourses.forEach(course => {
      for (let i = 1; i <= 5; i++) {
        lessons.push({
          title: `Lesson ${i}: Introduction and Basics`,
          description: `This is lesson ${i} for ${course.title}. You will learn the foundational concepts.`,
          videoURL: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
          order: i,
          duration: '10:00',
          courseId: course._id
        });
      }
    });

    await Lesson.insertMany(lessons);
    console.log('Lessons created');

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
