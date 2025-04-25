import { adminSupabase } from './supabase';

interface CreateAdminUserProps {
  email: string;
  password: string;
  metadata?: {
    [key: string]: any;
  };
}

// Function to verify admin_users table setup
const verifyAdminTable = async () => {
  try {
    // Check if table exists and has correct structure
    const { data, error } = await adminSupabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error verifying admin_users table:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in verifyAdminTable:', error);
    return false;
  }
};

export const createAdminUser = async ({ email, password, metadata = {} }: CreateAdminUserProps) => {
  try {
    // Verify table exists
    const tableExists = await verifyAdminTable();
    if (!tableExists) {
      console.error('admin_users table does not exist or is not accessible');
      return {
        success: false,
        error: 'Admin table not properly configured'
      };
    }

    // First, create the user
    const { data: authData, error: authError } = await adminSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          is_admin: true
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (authData.user) {
      // Create a record in the admin_users table
      const { error: adminError } = await adminSupabase
        .from('admin_users')
        .insert([
          {
            user_id: authData.user.id,
            email: email,
            created_at: new Date().toISOString()
          }
        ]);

      if (adminError) {
        console.error('Error creating admin user record:', adminError);
        throw adminError;
      }

      return {
        success: true,
        user: authData.user,
        message: 'Admin user created successfully'
      };
    }

    throw new Error('Failed to create admin user');
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to list all admin users
export const listAdminUsers = async () => {
  try {
    const { data, error } = await adminSupabase
      .from('admin_users')
      .select('*');

    if (error) {
      console.error('Error listing admin users:', error);
      return [];
    }

    console.log('Current admin users:', data);
    return data;
  } catch (error) {
    console.error('Error in listAdminUsers:', error);
    return [];
  }
};

export const isAdmin = async (userId: string) => {
  try {
    console.log('isAdmin: Starting admin check for user:', userId);
    
    if (!userId) {
      console.error('isAdmin: No userId provided for admin check');
      return false;
    }

    // Check if we have a valid service role client
    if (!adminSupabase) {
      console.error('isAdmin: Admin Supabase client not initialized');
      return false;
    }

    console.log('isAdmin: Querying admin_users table...');
    // Check the admin_users table directly using service role
    const { data: adminData, error: adminError } = await adminSupabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (adminError) {
      console.error('isAdmin: Error checking admin_users table:', adminError);
      return false;
    }

    if (!adminData) {
      console.log('isAdmin: No admin record found for user:', userId);
      return false;
    }

    console.log('isAdmin: Admin check successful. User is admin:', userId);
    console.log('isAdmin: Admin data:', adminData);
    return true;
  } catch (error) {
    console.error('isAdmin: Error in admin check:', error);
    return false;
  }
}; 