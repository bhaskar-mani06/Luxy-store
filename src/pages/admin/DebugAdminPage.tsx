import React, { useEffect, useState } from 'react';
import { adminSupabase } from '../../lib/supabase';

const DebugAdminPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [setupStatus, setSetupStatus] = useState<string | null>(null);

  const setupAdmin = async () => {
    try {
      setSetupStatus('Setting up admin...');
      
      // Create admin user
      const email = 'admin@luxy.com';
      const password = 'Admin@123';

      const { data: authData, error: authError } = await adminSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: true
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: adminError } = await adminSupabase
          .from('admin_users')
          .insert([
            {
              user_id: authData.user.id,
              email: email,
              created_at: new Date().toISOString()
            }
          ]);

        if (adminError) throw adminError;
        setSetupStatus('Admin setup completed successfully!');
        // Refresh the page to show updated status
        window.location.reload();
      }
    } catch (error: any) {
      setSetupStatus(`Setup failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check database connection
        const { data: dbData, error: dbError } = await adminSupabase
          .from('admin_users')
          .select('count')
          .limit(1);

        if (dbError) {
          setError(`Database connection error: ${dbError.message}`);
          setDbInfo({ connected: false, error: dbError.message });
        } else {
          setDbInfo({ connected: true, tableExists: true });
        }

        // Get current session
        const { data: { session } } = await adminSupabase.auth.getSession();
        
        if (session?.user) {
          setUserInfo({
            id: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata
          });

          // Check admin status
          const { data: adminData, error } = await adminSupabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            setError(`Admin check error: ${error.message}`);
          } else {
            setAdminInfo(adminData);
          }
        } else {
          setError('No active session found');
        }
      } catch (error: any) {
        setError(`Debug error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Debug Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {setupStatus && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {setupStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Database Status</h2>
          {dbInfo ? (
            <div className="bg-gray-50 p-4 rounded">
              <p className={dbInfo.connected ? "text-green-600" : "text-red-600"}>
                {dbInfo.connected ? "✅ Connected to database" : "❌ Database connection failed"}
              </p>
              {dbInfo.error && (
                <pre className="mt-2 text-sm">{dbInfo.error}</pre>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Checking database connection...</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          {userInfo ? (
            <pre className="bg-gray-50 p-4 rounded">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">No user information available</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Admin Status</h2>
          {adminInfo ? (
            <div>
              <p className="text-green-600">✅ You are registered as an admin</p>
              <pre className="bg-gray-50 p-4 rounded mt-2">
                {JSON.stringify(adminInfo, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p className="text-red-600">❌ You are not registered as an admin</p>
              <button
                onClick={setupAdmin}
                className="mt-4 bg-luxury-600 text-white px-4 py-2 rounded hover:bg-luxury-700"
              >
                Setup Admin User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugAdminPage; 