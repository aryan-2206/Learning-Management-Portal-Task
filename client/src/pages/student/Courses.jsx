import { useState, useEffect } from 'react';
import { Search, Filter, Clock, BarChart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  
  const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'IT & Software', 'Personal Development'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let url = '/courses?';
        if (searchTerm) url += `search=${searchTerm}&`;
        if (category !== 'All') url += `category=${category}&`;
        
        const res = await api.get(url);
        setCourses(res.data.data);
      } catch (error) {
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      fetchCourses();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, category]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">Explore Courses</h1>
          <p className="text-slate-500 dark:text-slate-400">Find the perfect course to advance your skills.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 text-white transition-all shadow-inner"
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="glass p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
              <Filter className="w-5 h-5" />
              <h3 className="font-heading font-bold text-lg">Categories</h3>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    category === cat 
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass h-80 rounded-3xl animate-pulse flex flex-col">
                  <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-t-3xl"></div>
                  <div className="p-5 flex-grow space-y-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="glass p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
              <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-3xl overflow-hidden card-hover flex flex-col group cursor-pointer"
                >
                  <Link to={`/course/${course._id}`} className="flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 shadow-sm">
                        {course.category}
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <img src={course.instructor?.avatar || `https://ui-avatars.com/api/?name=${course.instructor?.name || 'I'}`} alt={course.instructor?.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">{course.instructor?.name}</span>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                          <span className="flex items-center gap-1"><BarChart className="w-4 h-4" /> {course.difficulty}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
