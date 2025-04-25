import { adminSupabase } from '../lib/supabase';

const verifyAdminSetup = async () => {
  try {
    console.log('Verifying admin setup...');

    // Check if admin_users table exists
    const { data: tableInfo, error: tableError } = await adminSupabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('Error accessing admin_users table:', tableError);
      return;
    }

    console.log('Admin table exists and is accessible');

    // List all admin users
    const { data: adminUsers, error: adminError } = await adminSupabase
      .from('admin_users')
      .select('*');

    if (adminError) {
      console.error('Error listing admin users:', adminError);
      return;
    }

    console.log('Admin users:', adminUsers);

    // Check RLS policies
    const { data: policies, error: policyError } = await adminSupabase.rpc('get_table_policies', {
      table_name: 'admin_users'
    });

    if (policyError) {
      console.error('Error checking RLS policies:', policyError);
    } else {
      console.log('RLS policies:', policies);
    }

  } catch (error) {
    console.error('Error in verifyAdminSetup:', error);
  }
};

// Run the verification
verifyAdminSetup(); 