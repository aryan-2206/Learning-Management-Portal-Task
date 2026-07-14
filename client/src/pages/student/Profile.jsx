import { useState } from 'react';
import { User, Mail, Camera, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const Profile = () => {
  const { user, checkAuth } = useAuthStore();
  const [updating, setUpdating] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setUpdating(true);
      await api.put('/users/profile', data);
      await checkAuth(); // Refresh user data in store
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and account settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl text-center flex flex-col items-center">
            <div className="relative mb-6 group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 dark:border-primary-900 shadow-xl">
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h3>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div className="md:col-span-2">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Personal Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('name')}
                    type="text"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-white`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Avatar URL (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Camera className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('avatar')}
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.avatar ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white`}
                  />
                </div>
                {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar.message}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
