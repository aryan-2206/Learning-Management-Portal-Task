import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, PlayCircle, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    enrollments: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/enroll')
        ]);
        
        setStats({
          courses: coursesRes.data.count,
          enrollments: enrollmentsRes.data.count
        });
        
        // Take top 4 recent courses
        setRecentCourses(coursesRes.data.data.slice(0, 4));
      } catch (error) {
        toast.error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview of your platform's performance.</p>
        </div>
        <Link to="/admin/courses" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-primary-500/30">
          Manage Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Courses', value: stats.courses, icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Total Enrollments', value: stats.enrollments, icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
          { label: 'Platform Growth', value: '+12%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Active Learners', value: stats.enrollments > 0 ? stats.enrollments : 0, icon: PlayCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl flex items-center gap-5 card-hover">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Recent Courses</h2>
            <Link to="/admin/courses" className="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400">Course</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400">Category</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400">Difficulty</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                  <tr key={course._id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-slate-900 dark:text-white line-clamp-1">{course.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{course.category}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400">
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link to={`/admin/courses`} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium text-sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="lg:col-span-1 glass p-8 rounded-3xl bg-gradient-to-br from-primary-600 to-violet-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          <h2 className="text-2xl font-heading font-bold mb-4 relative z-10">Quick Actions</h2>
          <p className="text-primary-100 mb-8 relative z-10">Manage your platform efficiently from here.</p>
          
          <div className="space-y-3 relative z-10">
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm border border-white/20 flex justify-between items-center px-4">
              Add New Course <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm border border-white/20 flex justify-between items-center px-4">
              View Enrolled Users <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm border border-white/20 flex justify-between items-center px-4">
              Platform Settings <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
