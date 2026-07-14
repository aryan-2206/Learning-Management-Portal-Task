import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, reset } = useForm();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses');
      setCourses(res.data.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await api.post('/courses', data);
      toast.success('Course created successfully');
      setIsModalOpen(false);
      reset();
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success('Course deleted');
        fetchCourses();
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">Manage Courses</h1>
          <p className="text-slate-500 dark:text-slate-400">Create, edit, and delete platform courses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-primary-500/30"
        >
          <Plus className="w-5 h-5" /> Add New Course
        </button>
      </div>

      <div className="glass p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-slate-500 flex flex-col items-center">
            <BookOpen className="w-16 h-16 mb-4 text-slate-300" />
            <p>No courses found. Create one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400 pl-4">Course</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400">Category</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400">Difficulty</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400">Duration</th>
                  <th className="pb-4 font-heading font-semibold text-slate-500 dark:text-slate-400 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <span className="font-medium text-slate-900 dark:text-white block">{course.title}</span>
                          <span className="text-xs text-slate-500">{course.lessons?.length || 0} Lessons</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{course.category}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">{course.duration}</td>
                    <td className="py-4 text-right pr-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(course._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Add New Course</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Course Title</label>
                  <input {...register('title', { required: true })} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea {...register('description', { required: true })} rows={3} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                  <select {...register('category', { required: true })} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all">
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Personal Development">Personal Development</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                  <select {...register('difficulty', { required: true })} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration (e.g., 10 Hours)</label>
                  <input {...register('duration', { required: true })} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Thumbnail URL</label>
                  <input {...register('thumbnail')} className="w-full px-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all" />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-primary-500/30 disabled:opacity-70">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
