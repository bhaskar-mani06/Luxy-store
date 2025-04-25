import { supabase, adminSupabase } from '../lib/supabase';

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  received_at: string;
  read: boolean;
}

class MessageStore {
  private static instance: MessageStore;

  private constructor() {}

  public static getInstance(): MessageStore {
    if (!MessageStore.instance) {
      MessageStore.instance = new MessageStore();
    }
    return MessageStore.instance;
  }

  public async addMessage(message: Omit<Message, 'id' | 'received_at' | 'read'>): Promise<void> {
    console.log('Attempting to add message:', message);
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...message,
        received_at: new Date().toISOString(),
        read: false
      }])
      .select();

    if (error) {
      console.error('Error adding message:', error);
      throw error;
    }
    console.log('Message added successfully:', data);
  }

  public async getMessages(): Promise<Message[]> {
    console.log('Fetching messages from Supabase...');
    const { data, error } = await adminSupabase
      .from('messages')
      .select('*')
      .order('received_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    console.log('Messages retrieved:', data);
    return data || [];
  }

  public async deleteMessage(id: number): Promise<void> {
    const { error } = await adminSupabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  public async toggleReadStatus(id: number): Promise<void> {
    const { data, error: fetchError } = await adminSupabase
      .from('messages')
      .select('read')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching message:', fetchError);
      throw fetchError;
    }

    const { error: updateError } = await adminSupabase
      .from('messages')
      .update({ read: !data.read })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating message:', updateError);
      throw updateError;
    }
  }
}

export const messageStore = MessageStore.getInstance(); 