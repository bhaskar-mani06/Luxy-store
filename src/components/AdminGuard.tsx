import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { isAdmin } from '../lib/admin';
import { toast } from 'react-hot-toast';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const checkAdminStatus = async () => {
      try {
        console.log('AdminGuard: Starting admin status check');
        console.log('Current path:', location.pathname);
        
        // Skip check if already on login page
        if (location.pathname === '/admin/login') {
          console.log('AdminGuard: On login page, skipping check');
          setLoading(false);
          return;
        }

        // Skip if already authenticated
        if (isAuthenticated) {
          console.log('AdminGuard: Already authenticated, skipping check');
          setLoading(false);
          return;
        }

        // Prevent multiple redirects
        if (isRedirecting) {
          console.log('AdminGuard: Already redirecting, skipping check');
          return;
        }

        console.log('AdminGuard: Checking session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AdminGuard: Session error:', sessionError);
          if (mounted) {
            setIsRedirecting(true);
            toast.error('Authentication error. Please login again.');
            navigate('/admin/login', { replace: true });
          }
          return;
        }

        if (!session?.user) {
          console.log('AdminGuard: No active session found');
          if (mounted) {
            setIsRedirecting(true);
            toast.error('Please login to access admin panel');
            navigate('/admin/login', { replace: true });
          }
          return;
        }

        console.log('AdminGuard: Session found, checking admin status...');
        const adminStatus = await isAdmin(session.user.id);
        console.log('AdminGuard: Admin status result:', adminStatus);
        
        if (!adminStatus) {
          console.log('AdminGuard: User is not an admin');
          if (mounted) {
            setIsRedirecting(true);
            await supabase.auth.signOut();
            toast.error('You do not have admin access');
            navigate('/admin/login', { replace: true });
          }
          return;
        }

        console.log('AdminGuard: Admin access confirmed');
        if (mounted) {
          setIsAuthenticated(true);
          setLoading(false);
          setIsRedirecting(false);
        }
      } catch (error) {
        console.error('AdminGuard: Error checking admin status:', error);
        if (mounted) {
          setIsRedirecting(true);
          toast.error('Error verifying admin access');
          navigate('/admin/login', { replace: true });
        }
      }
    };

    // Set up auth state listener
    authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AdminGuard: Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          console.log('AdminGuard: User signed out');
          setIsAuthenticated(false);
          setIsRedirecting(true);
          navigate('/admin/login', { replace: true });
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('AdminGuard: User signed in or token refreshed');
        checkAdminStatus();
      }
    });

    // Initial check only if not authenticated
    if (!isAuthenticated) {
      checkAdminStatus();
    }

    // Cleanup function
    return () => {
      console.log('AdminGuard: Cleaning up');
      mounted = false;
      if (authSubscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [navigate, isAuthenticated]); // Only depend on navigate and isAuthenticated

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-600 mb-4"></div>
          <p className="text-luxury-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
} 