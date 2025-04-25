import { adminSupabase } from '../lib/supabase';

export async function addAdminUser(userId: string) {
  try {
    // Add user to admin_users table using service role
    const { error: insertError } = await adminSupabase
      .from('admin_users')
      .insert([{ user_id: userId }])
      .select();

    if (insertError) {
      console.error('Error adding admin user:', insertError);
      return;
    }

    console.log('Successfully added admin user');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Example usage:
// addAdminUser('ee5a0389-c20d-405a-96f8-f27f58a890aa'); 