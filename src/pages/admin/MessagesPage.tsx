import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, EyeOff } from 'lucide-react';
import { messageStore, Message } from '../../store/messageStore';
import { toast } from 'react-hot-toast';

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load messages from store
  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching messages...');
      const data = await messageStore.getMessages();
      console.log('Messages received:', data);
      setMessages(data);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await messageStore.deleteMessage(id);
      toast.success('Message deleted');
      await loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const toggleReadStatus = async (id: number) => {
    try {
      await messageStore.toggleReadStatus(id);
      await loadMessages();
    } catch (error) {
      console.error('Error toggling message status:', error);
      toast.error('Failed to update message status');
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      await toggleReadStatus(message.id);
    }
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Contact Form Messages</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <tr key={msg.id} className={`${!msg.read ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(msg.received_at).toLocaleString()}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{msg.email}</td>
                    <td className="px-4 py-4 max-w-[200px] truncate text-sm text-gray-500" title={msg.subject}>{msg.subject}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewMessage(msg)}
                          className="text-blue-600 hover:text-blue-800" 
                          title="View Message"
                        >
                           <Eye size={18} />
                        </button>
                        <a 
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                          className="text-green-600 hover:text-green-800"
                          title="Reply via Email"
                        >
                          <Mail size={18} />
                        </a>
                        <button 
                          onClick={() => toggleReadStatus(msg.id)} 
                          className={`${msg.read ? 'text-gray-500 hover:text-gray-700' : 'text-yellow-600 hover:text-yellow-800'}`}
                          title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {msg.read ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(msg.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No messages received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Message Details</h2>
              <button onClick={closeMessageModal} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
              <p><strong>Received:</strong> {new Date(selectedMessage.received_at).toLocaleString()}</p>
              <p><strong>Subject:</strong> {selectedMessage.subject}</p>
              <hr />
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
               <a 
                 href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
               >
                 <Mail size={16} />
                 <span>Reply</span>
               </a>
               <button 
                 onClick={async () => { 
                   await handleDelete(selectedMessage.id);
                   closeMessageModal();
                 }}
                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
               >
                  <Trash2 size={16} />
                 <span>Delete</span>
               </button>
              <button 
                onClick={closeMessageModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 