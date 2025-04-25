import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const AuthCheck = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const isLocalAuth = localStorage.getItem('adminAuth') === 'true';
      
      if (!session && !isLocalAuth) {
        console.log('No active session found');
        navigate('/admin/login');
        return;
      }

      console.log('Active session found:', session || 'local auth');
      setIsChecking(false);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/admin/login');
    }
  };

  if (isChecking) {
    return <div>Checking authentication...</div>;
  }

  return null;
}; 