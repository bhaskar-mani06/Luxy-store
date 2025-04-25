import { adminSupabase } from '../lib/supabase';

const addAdmin = async () => {
  try {
    const email = 'bhaskardubey06@gmail.com';
    
    // First, get the user by email
    const { data: userData, error: userError } = await adminSupabase.auth.admin.listUsers();

    if (userError) {
      console.error('Error listing users:', userError);
      return;
    }

    const user = userData.users.find(u => u.email === email);
    if (!user) {
      console.error('User not found with email:', email);
      return;
    }

    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await adminSupabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
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
      .insert([
        {
          user_id: user.id,
          email: email,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('Error adding admin user:', insertError);
      return;
    }

    console.log('Successfully added user as admin:', email);
  } catch (error) {
    console.error('Error in addAdmin:', error);
  }
};

// Run the setup
addAdmin(); 