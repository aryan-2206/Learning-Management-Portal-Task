import { ArrowRight, BookOpen, Users, Star, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-900 dark:to-primary-950/20 -z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-sm font-medium text-primary-600 dark:text-primary-400 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              LearnSphere 2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Master new skills with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">Premium Learning</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of students building their future with our industry-leading courses. Learn from experts, track your progress, and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium text-lg transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2">
                Explore Courses <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium text-lg transition-all shadow-md border border-slate-700 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Active Students', value: '50k+', icon: Users },
              { label: 'Premium Courses', value: '200+', icon: BookOpen },
              { label: 'Expert Instructors', value: '150+', icon: Star },
              { label: 'Success Rate', value: '99%', icon: CheckCircle },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl mb-4 text-primary-600 dark:text-primary-400">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our platform provides all the tools you need to master new skills effectively and efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Learn at your own pace',
                desc: 'Access lifetime course materials and watch lessons whenever you want.',
              },
              {
                title: 'Track your progress',
                desc: 'Stay motivated with our intuitive dashboard and learning streak features.',
              },
              {
                title: 'Expert led content',
                desc: 'Learn directly from industry professionals with years of experience.',
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-8 rounded-3xl card-hover"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-violet-700" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to start learning?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join our community today and get access to hundreds of premium courses.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-800 text-primary-400 hover:bg-slate-700 font-bold text-lg transition-all shadow-xl hover:shadow-2xl">
            Get Started For Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
