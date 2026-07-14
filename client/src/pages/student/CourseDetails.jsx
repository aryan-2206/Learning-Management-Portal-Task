import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, BarChart, PlayCircle, Users, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import { motion } from 'framer-motion';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.data);
        
        // If logged in, check enrollment status
        if (isAuthenticated) {
          const enrollRes = await api.get('/enroll/my-courses');
          const enrolled = enrollRes.data.data.find(c => c._id === id);
          if (enrolled) {
            setIsEnrolled(true);
            setProgress(enrolled.progress);
          }
        }
      } catch (error) {
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast('Please login to enroll', { icon: '👋' });
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await api.post('/enroll', { courseId: id });
      toast.success('Successfully enrolled!');
      setIsEnrolled(true);
      setProgress(0);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="md:w-1/3 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-20 text-2xl font-bold">Course not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Content */}
        <div className="lg:w-2/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-8 shadow-xl"
          >
            <img src={course.thumbnail} alt={course.title} className="w-full h-[400px] object-cover" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4"
          >
            {course.title}
          </motion.h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-medium">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full">
              {course.category}
            </span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" /> {course.duration}
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <BarChart className="w-4 h-4" /> {course.difficulty}
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <PlayCircle className="w-4 h-4" /> {course.lessons?.length || 0} Lessons
            </div>
          </div>

          <div className="glass p-8 rounded-3xl mb-8">
            <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-4">About this course</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>
          </div>

          <div className="glass p-8 rounded-3xl mb-8">
            <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">Course Content</h3>
            <div className="space-y-4">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, idx) => (
                  <div key={lesson._id} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-heading font-bold text-slate-900 dark:text-white">{lesson.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </p>
                    </div>
                    {isEnrolled && (
                      <div className="text-slate-400 shrink-0">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No lessons available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Sticky) */}
        <div className="lg:w-1/3">
          <div className="sticky top-28 glass p-8 rounded-3xl">
            {isEnrolled ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">You're Enrolled!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Continue your learning journey.</p>
                
                <div className="mb-6 text-left">
                  <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    <span>Course Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Link 
                  to={`/player/${course._id}`}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/30"
                >
                  <PlayCircle className="w-5 h-5" />
                  {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Resume Course'}
                </Link>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6 text-center">Ready to start?</h3>
                
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full flex justify-center items-center py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/30 mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {enrolling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enroll Now for Free'}
                </button>
                
                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Users className="w-5 h-5 text-primary-500" />
                    <span>Join thousands of students</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <PlayCircle className="w-5 h-5 text-primary-500" />
                    <span>Full lifetime access</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Instructor Info */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-4">Instructor</h4>
              <div className="flex items-center gap-4">
                <img src={course.instructor?.avatar} alt={course.instructor?.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{course.instructor?.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Expert Educator</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
