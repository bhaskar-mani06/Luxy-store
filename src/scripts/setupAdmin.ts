import { adminSupabase } from '../lib/supabase';

const setupAdmin = async () => {
  try {
    console.log('Setting up admin table...');

    // Check if admin_users table exists
    const { data: existingAdmins, error: checkError } = await adminSupabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('Error checking admin table:', checkError);
      return;
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('Admin table and users already exist. Skipping setup.');
      console.log('Existing admin users:', existingAdmins);
      return;
    }

    // Create admin user
    const email = 'admin@luxystore.com';
    const password = 'Admin@123';

    console.log('Creating admin user...');
    const { data: authData, error: authError } = await adminSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_admin: true
        }
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    if (authData.user) {
      console.log('Auth user created, adding to admin_users table...');
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
        console.error('Error adding user to admin_users:', adminError);
        return;
      }

      console.log('Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    }
  } catch (error) {
    console.error('Error in setupAdmin:', error);
  }
};

// Run the setup
setupAdmin(); 