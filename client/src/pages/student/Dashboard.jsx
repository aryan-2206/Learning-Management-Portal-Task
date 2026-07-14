import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, PlayCircle, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get('/enroll/my-courses');
        setEnrolledCourses(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const completedCount = enrolledCourses.filter(c => c.progress === 100).length;
  const inProgressCount = enrolledCourses.filter(c => c.progress < 100).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-primary-100 max-w-lg">Ready to continue your learning journey? You've made great progress so far.</p>
          </div>
          <Link to="/courses" className="px-6 py-3 bg-slate-800 text-primary-400 rounded-full font-medium hover:bg-slate-700 transition-colors shadow-lg shrink-0">
            Browse New Courses
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Enrolled Courses', value: enrolledCourses.length, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'In Progress', value: inProgressCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Completed', value: completedCount, icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl flex items-center gap-5 card-hover"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Learning */}
      <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6">Continue Learning</h2>
      
      {enrolledCourses.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't enrolled in any courses. Start your journey today!</p>
          <Link to="/courses" className="inline-flex px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course, i) => (
            <motion.div 
              key={course._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl overflow-hidden card-hover flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400">
                  {course.category}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                
                <div className="mt-auto pt-4 space-y-3">
                  <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-violet-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  
                  <Link 
                    to={`/course/${course._id}`}
                    className="mt-4 w-full py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    {course.progress === 100 ? (
                      <><Award className="w-4 h-4" /> Review Course</>
                    ) : (
                      <><PlayCircle className="w-4 h-4" /> Resume Course</>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
