import React, { useState } from 'react';
import '../styles/chat.css';

const Chat: React.FC = () => {
  // Mock data for chats
  const initialChats = [
    {
      id: 'chat1',
      user: {
        id: 'user1',
        name: 'John Smith',
        university: 'University of British Columbia',
        type: 'Exchange Partner',
        photo: '/profile-placeholder.png',
        online: true
      },
      messages: [
        {
          id: 'msg1',
          sender: 'user1',
          text: 'Hi there! I\'m John from UBC. I\'ll be coming to HKUST next semester while you\'ll be at UBC. Thought it would be great to connect!',
          timestamp: '2025-10-15T14:30:00Z',
          read: true
        },
        {
          id: 'msg2',
          sender: 'currentUser',
          text: 'Hey John! Great to hear from you. Yes, I\'m excited to be going to UBC while you\'ll be at my home university. Do you have any questions about HKUST or Hong Kong in general?',
          timestamp: '2025-10-15T14:35:00Z',
          read: true
        },
        {
          id: 'msg3',
          sender: 'user1',
          text: 'Actually, I do! I\'m wondering about the housing situation at HKUST. Are there any specific dorms you\'d recommend for exchange students?',
          timestamp: '2025-10-15T14:40:00Z',
          read: true
        }
      ],
      lastActivity: '2025-10-15T14:40:00Z'
    },
    {
      id: 'chat2',
      user: {
        id: 'user2',
        name: 'Dr. James Wong',
        university: 'University of British Columbia',
        type: 'Alumni',
        photo: '/profile-placeholder.png',
        online: false
      },
      messages: [
        {
          id: 'msg4',
          sender: 'user2',
          text: 'Hello! I\'m Dr. Wong, an alumnus of HKUST now working at UBC. I saw that you\'re going to be studying here next semester. Feel free to ask if you have any questions about the campus or Vancouver in general.',
          timestamp: '2025-10-14T10:15:00Z',
          read: true
        },
        {
          id: 'msg5',
          sender: 'currentUser',
          text: 'Hi Dr. Wong! Thanks for reaching out. I\'m actually curious about the weather in Vancouver during the winter. How cold does it get, and what kind of clothing should I bring?',
          timestamp: '2025-10-14T10:20:00Z',
          read: true
        }
      ],
      lastActivity: '2025-10-14T10:20:00Z'
    },
    {
      id: 'chat3',
      user: {
        id: 'user3',
        name: 'Sarah Chen',
        university: 'University of Washington',
        type: 'Area Connection',
        photo: '/profile-placeholder.png',
        online: true
      },
      messages: [
        {
          id: 'msg6',
          sender: 'currentUser',
          text: 'Hi Sarah! I saw that you\'ll be at University of Washington next semester. Since that\'s pretty close to UBC where I\'ll be, I thought it might be nice to connect!',
          timestamp: '2025-10-13T16:45:00Z',
          read: true
        },
        {
          id: 'msg7',
          sender: 'user3',
          text: 'Hey there! That\'s great! I\'m excited to explore the Pacific Northwest. Maybe we could meet up in Seattle or Vancouver sometime during the semester?',
          timestamp: '2025-10-13T17:00:00Z',
          read: false
        }
      ],
      lastActivity: '2025-10-13T17:00:00Z'
    }
  ];

  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(initialChats[0]);
  const [messageText, setMessageText] = useState('');
  const [suggestedResponses, setSuggestedResponses] = useState([
    "Yes, I'd recommend Hall IX for exchange students. It's newer and has a great community.",
    "The winter in Hong Kong is mild, usually around 15-20°C (59-68°F). You won't need heavy winter clothing.",
    "I'd be happy to show you around when you arrive. What are you most interested in seeing?"
  ]);

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
    
    // Mark unread messages as read
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        const updatedMessages = c.messages.map(msg => {
          if (msg.sender !== 'currentUser') {
            return { ...msg, read: true };
          }
          return msg;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    });
    
    setChats(updatedChats);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'currentUser',
      text: messageText,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastActivity: new Date().toISOString()
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastActivity: new Date().toISOString()
    });
    setMessageText('');
    
    // Generate new suggested responses based on the message
    setSuggestedResponses([
      "I'm glad I could help! Let me know if you have any other questions.",
      "That sounds great! I'm looking forward to it.",
      "By the way, have you looked into the exchange student orientation program?"
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getUnreadCount = (chat: any) => {
    return chat.messages.filter((msg: any) => msg.sender !== 'currentUser' && !msg.read).length;
  };

  const handleSuggestedResponse = (response: string) => {
    setMessageText(response);
  };

  return (
    <div className="chat-page">
      <h1 className="page-title">Chat</h1>
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-search">
            <input type="text" placeholder="Search conversations..." />
          </div>
          
          <div className="chat-list">
            {chats.map(chat => (
              <div 
                className={`chat-item ${selectedChat.id === chat.id ? 'selected' : ''}`}
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-avatar">
                  {chat.user.photo ? (
                    <img src={chat.user.photo} alt={chat.user.name} />
                  ) : (
                    chat.user.name.charAt(0)
                  )}
                  {chat.user.online && <span className="online-indicator"></span>}
                </div>
                
                <div className="chat-preview">
                  <div className="chat-header">
                    <h3>{chat.user.name}</h3>
                    <span className="chat-time">{formatDate(chat.lastActivity)}</span>
                  </div>
                  <p className="chat-last-message">
                    {chat.messages[chat.messages.length - 1].text.length > 40
                      ? chat.messages[chat.messages.length - 1].text.substring(0, 40) + '...'
                      : chat.messages[chat.messages.length - 1].text
                    }
                  </p>
                  <div className="chat-meta">
                    <span className="chat-type">{chat.user.type}</span>
                    {getUnreadCount(chat) > 0 && (
                      <span className="unread-count">{getUnreadCount(chat)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <div className="chat-avatar">
                    {selectedChat.user.photo ? (
                      <img src={selectedChat.user.photo} alt={selectedChat.user.name} />
                    ) : (
                      selectedChat.user.name.charAt(0)
                    )}
                    {selectedChat.user.online && <span className="online-indicator"></span>}
                  </div>
                  <div className="chat-user-info">
                    <h3>{selectedChat.user.name}</h3>
                    <p>{selectedChat.user.university} • {selectedChat.user.type}</p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="btn-icon">
                    <i className="action-icon">📞</i>
                  </button>
                  <button className="btn-icon">
                    <i className="action-icon">📹</i>
                  </button>
                  <button className="btn-icon">
                    <i className="action-icon">ℹ️</i>
                  </button>
                </div>
              </div>
              
              <div className="chat-messages">
                {selectedChat.messages.map((message: any) => (
                  <div 
                    className={`message ${message.sender === 'currentUser' ? 'outgoing' : 'incoming'}`}
                    key={message.id}
                  >
                    {message.sender !== 'currentUser' && (
                      <div className="message-avatar">
                        {selectedChat.user.photo ? (
                          <img src={selectedChat.user.photo} alt={selectedChat.user.name} />
                        ) : (
                          selectedChat.user.name.charAt(0)
                        )}
                      </div>
                    )}
                    <div className="message-content">
                      <div className="message-bubble">
                        {message.text}
                      </div>
                      <div className="message-meta">
                        <span className="message-time">{formatDate(message.timestamp)}</span>
                        {message.sender === 'currentUser' && (
                          <span className="message-status">
                            {message.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="chat-input-area">
                <div className="suggested-responses">
                  {suggestedResponses.map((response, index) => (
                    <button 
                      className="suggested-response" 
                      key={index}
                      onClick={() => handleSuggestedResponse(response)}
                    >
                      {response.length > 40 ? response.substring(0, 40) + '...' : response}
                    </button>
                  ))}
                  <div className="ai-badge small">
                    <span className="ai-icon">🧠</span>
                    <span className="ai-text">IBM WatsonX</span>
                  </div>
                </div>
                
                <div className="chat-input">
                  <button className="btn-icon">
                    <i className="action-icon">😊</i>
                  </button>
                  <textarea 
                    placeholder="Type a message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="btn-icon">
                    <i className="action-icon">📎</i>
                  </button>
                  <button 
                    className="btn-send"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <i className="action-icon">📤</i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Select a Conversation</h3>
              <p>Choose a chat from the list to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
