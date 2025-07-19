import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, serviceRoleSupabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if already logged in and is admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: adminData } = await serviceRoleSupabase
            .from('admin_users')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          if (adminData) {
            // Get return URL from state or default to dashboard
            const state = location.state as { returnTo?: string };
            const returnTo = state?.returnTo || '/admin/dashboard';
            navigate(returnTo, { replace: true });
          } else {
            // If logged in but not admin, sign out
            await supabase.auth.signOut();
            toast.error('You do not have admin access');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First sign out any existing session
      await supabase.auth.signOut();
      
      console.log('Attempting admin login with email:', email);
      
      // Step 1: Sign in with email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error('Invalid credentials');
      }

      if (!authData.user) {
        console.error('No user data returned');
        throw new Error('Login failed');
      }

      console.log('Login successful, checking admin status for user ID:', authData.user.id);

      // Step 2: Check if user is admin using service role client
      const { data: adminData, error: adminError } = await serviceRoleSupabase
        .from('admin_users')
        .select('id')
        .eq('user_id', authData.user.id)
        .single();

      console.log('Admin check result:', { adminData, adminError });

      if (adminError) {
        console.error('Admin check error:', adminError);
        throw new Error('Failed to verify admin status');
      }

      if (!adminData) {
        console.log('User not found in admin_users table');
        // Sign out the user if they're not an admin
        await supabase.auth.signOut();
        throw new Error('Unauthorized access - Admin only');
      }

      // Success - navigate to return URL or dashboard
      toast.success('Welcome back, Admin!');
      const state = location.state as { returnTo?: string };
      const returnTo = state?.returnTo || '/admin/dashboard';
      navigate(returnTo, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
      // Clear the session on error
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-600 mb-4"></div>
          <p className="text-luxury-600">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your admin credentials
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-luxury-500 focus:border-luxury-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2" style={{ position: 'relative' }}>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-luxury-500 focus:border-luxury-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-luxury-600 hover:bg-luxury-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 