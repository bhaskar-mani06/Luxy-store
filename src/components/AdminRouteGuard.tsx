import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminSupabase } from '../lib/supabase';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check localStorage
        const storedAdminStatus = localStorage.getItem('isAdmin');
        if (storedAdminStatus === 'true') {
          // Then verify with Supabase
          const { data: { session } } = await adminSupabase.auth.getSession();
          if (session?.user) {
            const { data, error } = await adminSupabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (error) {
              console.error('Error checking admin status:', error);
              localStorage.removeItem('isAdmin');
              setIsAdmin(false);
            } else if (data) {
              setIsAdmin(true);
            } else {
              localStorage.removeItem('isAdmin');
              setIsAdmin(false);
            }
          } else {
            localStorage.removeItem('isAdmin');
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error in AdminRouteGuard:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard; 