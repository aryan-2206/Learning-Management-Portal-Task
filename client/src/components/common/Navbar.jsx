import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-heading font-bold text-white">
            Learn<span className="text-primary-400">Sphere</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/courses" className="text-slate-300 hover:text-primary-400 font-medium transition-colors">
            Courses
          </Link>
          {isAuthenticated && (
            <Link
              to={user?.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-slate-300 hover:text-primary-400 font-medium transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-500 hover:scale-105 transition-transform">
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-red-900/30 hover:text-red-400 text-slate-300 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:block text-slate-300 hover:text-primary-400 font-medium transition-colors">
                Log In
              </Link>
              <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-primary-500/30">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
