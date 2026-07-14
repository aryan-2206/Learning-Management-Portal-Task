import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Register = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });
  
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await register({ ...data, role: 'student' });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-950">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 glass p-10 rounded-3xl relative z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-heading font-bold text-white">
              Learn<span className="text-primary-400">Sphere</span>
            </span>
          </Link>
          <h2 className="text-3xl font-heading font-bold text-white">Create an account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Join thousands of learners today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                {...registerField('name')}
                type="text"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <input
                {...registerField('email')}
                type="email"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                {...registerField('password')}
                type="password"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create account'}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
