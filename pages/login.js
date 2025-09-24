import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: 'admin',
    email: 'admin@example.com',
    password: 'password123',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid credentials');
        } else {
          router.push('/dashboard');
        }
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setError('');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        } else {
          setError(data.message);
        }
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
      </div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] p-4 rounded-2xl shadow-xl mx-auto w-16 h-16 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join Us Today'}
          </h2>
          <p className="mt-2 text-lg text-slate-700">
            {isLogin ? 'Sign in to your meal planner account' : 'Create your meal planner account'}
          </p>
          {isLogin && (
            <p className="mt-2 text-sm text-slate-600">
              Default: admin@example.com / password123
            </p>
          )}
          <p className="mt-4 text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-slate-700 hover:text-amber-600 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-slate-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <CustomInput
                label="Full Name"
                name="name"
                type="text"
                required={!isLogin}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            )}
            
            <CustomInput
              label="Email Address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            
            <CustomInput
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl text-sm backdrop-blur-md">
                {error}
              </div>
            )}

            <div>
              <CustomButton
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
