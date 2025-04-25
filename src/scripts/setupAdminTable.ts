import { adminSupabase } from '../lib/supabase';

async function setupAdminTable() {
  try {
    // Create admin_users table if it doesn't exist
    const { error: createTableError } = await adminSupabase.rpc('create_admin_users_table');
    
    if (createTableError) {
      console.error('Error creating admin_users table:', createTableError);
      return;
    }

    console.log('Admin users table created successfully');

    // Get the current user's ID
    const { data: { user }, error: userError } = await adminSupabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return;
    }

    if (!user) {
      console.error('No user found');
      return;
    }

    // Check if user is already in admin_users table
    const { data: existingAdmin, error: checkError } = await adminSupabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking admin status:', checkError);
      return;
    }

    if (existingAdmin) {
      console.log('User is already an admin');
      return;
    }

    // Add user to admin_users table
    const { error: insertError } = await adminSupabase
      .from('admin_users')
      .insert([{ user_id: user.id }]);

    if (insertError) {
      console.error('Error adding admin user:', insertError);
      return;
    }

    console.log('Successfully added admin user');
  } catch (error) {
    console.error('Error in setupAdminTable:', error);
  }
}

// Run the setup
setupAdminTable(); 