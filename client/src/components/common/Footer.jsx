import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-heading font-bold text-white">
                Learn<span className="text-primary-500">Sphere</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              A premium learning management system designed for modern creators, students, and professionals to build the future together.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-primary-400 transition-colors">All Courses</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
