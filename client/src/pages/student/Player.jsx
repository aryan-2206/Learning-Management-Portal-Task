import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, ArrowLeft, Loader2, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/progress/${id}`)
        ]);
        
        const courseData = courseRes.data.data;
        setCourse(courseData);
        setProgress(progressRes.data.data.percentageCompleted);
        setCompletedLessons(progressRes.data.data.completedLessons);
        
        // Find next incomplete lesson, or just first lesson
        if (courseData.lessons?.length > 0) {
          const incompleteLesson = courseData.lessons.find(l => !progressRes.data.data.completedLessons.includes(l._id));
          setActiveLesson(incompleteLesson || courseData.lessons[0]);
        }
      } catch (error) {
        toast.error('Failed to load course player');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, navigate]);

  const handleMarkComplete = async () => {
    try {
      if (!completedLessons.includes(activeLesson._id)) {
        await api.post('/progress', {
          courseId: id,
          lessonId: activeLesson._id
        });
        
        // Refresh progress
        const progressRes = await api.get(`/progress/${id}`);
        setProgress(progressRes.data.data.percentageCompleted);
        setCompletedLessons(progressRes.data.data.completedLessons);
        toast.success('Lesson marked as complete!');
        
        // Auto-advance to next lesson if available
        const currentIndex = course.lessons.findIndex(l => l._id === activeLesson._id);
        if (currentIndex < course.lessons.length - 1) {
          setActiveLesson(course.lessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex(l => l._id === activeLesson?._id);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <Link to={`/course/${id}`} className="flex items-center gap-2 text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-heading font-bold text-slate-900 dark:text-white line-clamp-2 mb-4">{course.title}</h2>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div 
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {course.lessons.map((lesson, idx) => {
            const isActive = activeLesson?._id === lesson._id;
            const isCompleted = completedLessons.includes(lesson._id);
            
            return (
              <button
                key={lesson._id}
                onClick={() => {
                  setActiveLesson(lesson);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-colors ${isActive ? 'bg-primary-900/30 border-primary-800 border' : 'hover:bg-slate-800/50 border border-transparent'}`}
              >
                <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${isCompleted ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>
                <div>
                  <h4 className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-primary-700 dark:text-primary-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{lesson.duration}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-grow text-center lg:text-left lg:pl-6">
            <h1 className="font-heading font-bold text-slate-900 dark:text-white line-clamp-1">{activeLesson?.title}</h1>
          </div>
          {completedLessons.includes(activeLesson?._id) ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full font-medium text-sm">
              <CheckCircle className="w-4 h-4" /> Completed
            </div>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium text-sm transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" /> Mark Complete
            </button>
          )}
        </header>

        <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 relative border border-slate-800">
            {/* We use an iframe for youtube embed or a video tag for direct url. Assumes youtube embed url for placeholder */}
            <iframe 
              src={activeLesson?.videoURL} 
              title={activeLesson?.title}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex justify-between items-center mb-12">
            <button
              disabled={currentIndex === 0}
              onClick={() => setActiveLesson(course.lessons[currentIndex - 1])}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Previous Lesson
            </button>
            <button
              disabled={currentIndex === course.lessons.length - 1}
              onClick={() => setActiveLesson(course.lessons[currentIndex + 1])}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 transition-colors"
            >
              Next Lesson <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-4">Lesson Notes</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{activeLesson?.description}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Player;
