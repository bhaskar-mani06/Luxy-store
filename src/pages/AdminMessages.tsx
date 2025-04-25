import React, { useState, useEffect } from 'react';
import { messageStore, Message } from '../store/messageStore';
import { format } from 'date-fns';
import { Trash2, Mail, MailOpen } from 'lucide-react';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load messages initially
    setMessages(messageStore.getMessages());

    // Set up event listener for store updates
    const handleStoreUpdate = () => {
      setMessages(messageStore.getMessages());
    };

    window.addEventListener('messageStoreUpdate', handleStoreUpdate);

    return () => {
      window.removeEventListener('messageStoreUpdate', handleStoreUpdate);
    };
  }, []);

  const handleDelete = (id: string) => {
    messageStore.deleteMessage(id);
  };

  const handleToggleRead = (id: string) => {
    messageStore.toggleMessageRead(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Messages</h1>
      <div className="grid gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg shadow-md ${
              message.read ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{message.subject}</h2>
                <p className="text-gray-600">
                  From: {message.name} ({message.email})
                </p>
                <p className="text-gray-500 text-sm">
                  Received: {format(new Date(message.receivedAt), 'PPpp')}
                </p>
                <p className="mt-2">{message.message}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleRead(message.id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title={message.read ? "Mark as unread" : "Mark as read"}
                >
                  {message.read ? (
                    <MailOpen className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Mail className="w-5 h-5 text-blue-500" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(message.id)}
                  className="p-2 hover:bg-red-100 rounded-full"
                  title="Delete message"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages; 