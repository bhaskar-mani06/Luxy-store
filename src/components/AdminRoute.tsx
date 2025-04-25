import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase, serviceRoleSupabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await serviceRoleSupabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (adminError || !adminData) {
          console.error('Admin check failed:', adminError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // Store the attempted URL
    const returnTo = location.pathname + location.search;
    return <Navigate to="/admin/login" state={{ returnTo }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 