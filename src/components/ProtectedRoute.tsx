import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, serviceRoleSupabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        // Get current session using public client
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('ProtectedRoute: Session check result:', {
          hasSession: Boolean(session),
          userId: session?.user?.id,
          error: sessionError
        });

        if (sessionError) {
          console.error('ProtectedRoute: Session error:', sessionError);
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        if (!session?.user) {
          console.log('ProtectedRoute: No valid session found');
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Check if user exists in admin_users table using service role client
        const { data: adminData, error: adminError } = await serviceRoleSupabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        console.log('ProtectedRoute: Admin check result:', {
          adminData,
          error: adminError
        });

        if (adminError) {
          console.error('ProtectedRoute: Admin check error:', adminError);
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        if (!adminData) {
          console.log('ProtectedRoute: User not found in admin_users table');
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        console.log('ProtectedRoute: User is confirmed admin');
        if (isMounted) {
          setIsAdmin(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('ProtectedRoute: Error in checkAdmin:', error);
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // If not admin, redirect to admin login page instead of auth page
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 