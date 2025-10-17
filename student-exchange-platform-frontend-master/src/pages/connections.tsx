import React, { useState } from 'react';
import '../styles/connections.css';

const Connections: React.FC = () => {
  // Mock data for connections
  const initialConnections = [
    {
      id: 1,
      name: 'John Smith',
      type: 'Exchange Partner',
      university: 'University of British Columbia',
      location: 'Vancouver, Canada',
      interests: ['Hiking', 'Gaming', 'Cooking'],
      email: 'johns@ubc.ca',
      phone: '+1 604 123 4567',
      wechat: 'john_smith_ubc',
      compatibility: 8.5,
      photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Dr. James Wong',
      type: 'Alumni',
      university: 'University of British Columbia',
      location: 'Vancouver, Canada',
      position: 'Assistant Professor',
      graduationYear: 2015,
      email: 'jameswong@alumni.ust.hk',
      linkedin: 'james-wong-phd',
      compatibility: 7.2,
      photo: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 3,
      name: 'Thomas Cheung',
      type: 'Past Exchange Student',
      university: 'University of British Columbia',
      exchangePeriod: 'Fall 2023',
      major: 'Environmental Science',
      experienceRating: 9,
      adviceTopics: ['Housing', 'Courses', 'Local Transportation'],
      email: 'thomasc@alumni.ust.hk',
      wechat: 'thomas_c',
      compatibility: 6.8,
      photo: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      id: 4,
      name: 'Sarah Chen',
      type: 'Area Connection',
      university: 'University of Washington',
      location: 'Seattle, USA',
      interests: ['Photography', 'Hiking', 'Reading'],
      email: 'sarahc@connect.ust.hk',
      wechat: 'sarahchen_hk',
      compatibility: 9.0,
      photo: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 5,
      name: 'Emma Wilson',
      type: 'Exchange Partner',
      university: 'University of Oxford',
      location: 'Oxford, UK',
      interests: ['Literature', 'Tennis', 'Travel'],
      email: 'emmaw@oxford.ac.uk',
      phone: '+44 7123 456789',
      wechat: 'emma_wilson',
      compatibility: 7.5,
      photo: 'https://randomuser.me/api/portraits/women/67.jpg'
    }
  ];

  const [connections, setConnections] = useState(initialConnections);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleConnectionClick = (connection: any) => {
    setSelectedConnection(connection);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'all') {
      setConnections(initialConnections);
    } else {
      setConnections(initialConnections.filter(conn => conn.type.toLowerCase().includes(tab)));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      handleTabChange(activeTab);
      return;
    }
    
    const filtered = initialConnections.filter(conn => {
      if (activeTab !== 'all' && !conn.type.toLowerCase().includes(activeTab)) {
        return false;
      }
      
      return (
        conn.name.toLowerCase().includes(term) ||
        conn.university.toLowerCase().includes(term) ||
        (conn.location && conn.location.toLowerCase().includes(term))
      );
    });
    
    setConnections(filtered);
  };

  // No icons, just return empty string
  const getConnectionIcon = (type: string) => {
    return '';
  };

  const renderConnectionDetails = (connection: any) => {
    switch (connection.type) {
      case 'Exchange Partner':
        return (
          <>
            <div className="connection-section">
              <h3>University</h3>
              <p>{connection.university}</p>
            </div>
            
            <div className="connection-section">
              <h3>Location</h3>
              <p>{connection.location}</p>
            </div>
            
            <div className="connection-section">
              <h3>Interests</h3>
              <div className="tag-list">
                {connection.interests.map((interest: string, index: number) => (
                  <span className="tag" key={index}>{interest}</span>
                ))}
              </div>
            </div>
            
            <div className="connection-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="contact-icon">✉️</i>
                  <span>{connection.email}</span>
                </div>
                {connection.phone && (
                  <div className="contact-item">
                    <i className="contact-icon">📱</i>
                    <span>{connection.phone}</span>
                  </div>
                )}
                {connection.wechat && (
                  <div className="contact-item">
                    <i className="contact-icon">💬</i>
                    <span>WeChat: {connection.wechat}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );
        
      case 'Alumni':
        return (
          <>
            <div className="connection-section">
              <h3>Current Position</h3>
              <p>{connection.position} at {connection.university}</p>
            </div>
            
            <div className="connection-section">
              <h3>Location</h3>
              <p>{connection.location}</p>
            </div>
            
            <div className="connection-section">
              <h3>Graduation Year</h3>
              <p>{connection.graduationYear}</p>
            </div>
            
            <div className="connection-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="contact-icon">✉️</i>
                  <span>{connection.email}</span>
                </div>
                {connection.linkedin && (
                  <div className="contact-item">
                    <i className="contact-icon">💼</i>
                    <span>LinkedIn: {connection.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );
        
      case 'Past Exchange Student':
        return (
          <>
            <div className="connection-section">
              <h3>Exchange University</h3>
              <p>{connection.university}</p>
            </div>
            
            <div className="connection-section">
              <h3>Exchange Period</h3>
              <p>{connection.exchangePeriod}</p>
            </div>
            
            <div className="connection-section">
              <h3>Major</h3>
              <p>{connection.major}</p>
            </div>
            
            <div className="connection-section">
              <h3>Experience Rating</h3>
              <div className="rating">
                <div className="rating-stars">
                  {Array(10).fill(0).map((_, i) => (
                    <span key={i} className={i < connection.experienceRating ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
                <span className="rating-text">{connection.experienceRating}/10</span>
              </div>
            </div>
            
            <div className="connection-section">
              <h3>Can Advise On</h3>
              <div className="tag-list">
                {connection.adviceTopics.map((topic: string, index: number) => (
                  <span className="tag" key={index}>{topic}</span>
                ))}
              </div>
            </div>
            
            <div className="connection-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="contact-icon">✉️</i>
                  <span>{connection.email}</span>
                </div>
                {connection.wechat && (
                  <div className="contact-item">
                    <i className="contact-icon">💬</i>
                    <span>WeChat: {connection.wechat}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );
        
      case 'Area Connection':
        return (
          <>
            <div className="connection-section">
              <h3>University</h3>
              <p>{connection.university}</p>
            </div>
            
            <div className="connection-section">
              <h3>Location</h3>
              <p>{connection.location}</p>
            </div>
            
            <div className="connection-section">
              <h3>Interests</h3>
              <div className="tag-list">
                {connection.interests.map((interest: string, index: number) => (
                  <span className="tag" key={index}>{interest}</span>
                ))}
              </div>
            </div>
            
            <div className="connection-section">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="contact-icon">✉️</i>
                  <span>{connection.email}</span>
                </div>
                {connection.wechat && (
                  <div className="contact-item">
                    <i className="contact-icon">💬</i>
                    <span>WeChat: {connection.wechat}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="connections-page">
      <h1 className="page-title">Connections</h1>
      
      <div className="connections-container">
        <div className="connections-sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="connection-tabs">
            <button 
              className={activeTab === 'all' ? 'tab-button active' : 'tab-button'}
              onClick={() => handleTabChange('all')}
            >
              All
            </button>
            <button 
              className={activeTab === 'exchange' ? 'tab-button active' : 'tab-button'}
              onClick={() => handleTabChange('exchange')}
            >
              Exchange Partners
            </button>
            <button 
              className={activeTab === 'alumni' ? 'tab-button active' : 'tab-button'}
              onClick={() => handleTabChange('alumni')}
            >
              Alumni
            </button>
            <button 
              className={activeTab === 'past' ? 'tab-button active' : 'tab-button'}
              onClick={() => handleTabChange('past')}
            >
              Past Students
            </button>
            <button 
              className={activeTab === 'area' ? 'tab-button active' : 'tab-button'}
              onClick={() => handleTabChange('area')}
            >
              Area Connections
            </button>
          </div>
          
          <div className="connections-list">
            {connections.length === 0 ? (
              <div className="no-connections">
                <p>No connections found.</p>
              </div>
            ) : (
              connections.map(connection => (
                <div 
                  className={`connection-item ${selectedConnection === connection ? 'selected' : ''}`}
                  key={connection.id}
                  onClick={() => handleConnectionClick(connection)}
                >
                  <div className="connection-avatar">
                    {connection.photo ? (
                      <img src={connection.photo} alt={connection.name} />
                    ) : (
                      connection.name.charAt(0)
                    )}
                  </div>
                  <div className="connection-info">
                    <h3>{connection.name}</h3>
                    <p>{connection.university}</p>
                    <div className="connection-meta">
                      <span className="connection-type">
                        {getConnectionIcon(connection.type)} {connection.type}
                      </span>
                    </div>
                  </div>
                  <div className="connection-compatibility">
                    <span className="compatibility-score">{connection.compatibility}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* AI badge removed */}
        </div>
        
        <div className="connection-details">
          {selectedConnection ? (
            <>
              <div className="connection-header">
                <div className="connection-profile">
                  <div className="connection-avatar large">
                    {selectedConnection.photo ? (
                      <img src={selectedConnection.photo} alt={selectedConnection.name} />
                    ) : (
                      selectedConnection.name.charAt(0)
                    )}
                  </div>
                  <div className="connection-title">
                    <h2>{selectedConnection.name}</h2>
                    <span className="connection-type">
                      {getConnectionIcon(selectedConnection.type)} {selectedConnection.type}
                    </span>
                  </div>
                </div>
                
                <div className="connection-actions">
                  <button className="btn btn-primary">
                    <i className="action-icon">💬</i>
                    Message
                  </button>
                  <button className="btn btn-secondary">
                    <i className="action-icon">📋</i>
                    View Profile
                  </button>
                </div>
              </div>
              
              <div className="compatibility-card">
                <div className="compatibility-header">
                  <h3>Compatibility Score</h3>
                  <div className="compatibility-score-large">
                    <span className="score">{selectedConnection.compatibility}</span>
                    <span className="score-max">/10</span>
                  </div>
                </div>
                <p className="compatibility-explanation">
                  This score is calculated based on shared interests, academic background, and communication style.
                </p>
              </div>
              
              <div className="connection-content">
                {renderConnectionDetails(selectedConnection)}
              </div>
              
              <div className="conversation-starters">
                <h3>Conversation Starters</h3>
                <div className="starter-list">
                  <div className="starter-item">
                    <i className="starter-icon">💡</i>
                    <p>"I see we're both interested in {selectedConnection.interests ? selectedConnection.interests[0] : 'exchange programs'}. What got you into that?"</p>
                  </div>
                  <div className="starter-item">
                    <i className="starter-icon">💡</i>
                    <p>"What are you most looking forward to about {selectedConnection.type === 'Exchange Partner' ? 'your exchange at HKUST' : 'studying abroad'}?"</p>
                  </div>
                  <div className="starter-item">
                    <i className="starter-icon">💡</i>
                    <p>"I'd love to hear more about {selectedConnection.university}. What should I know before I arrive?"</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔗</div>
              <h3>Select a Connection</h3>
              <p>Click on a connection from the list to view detailed information and contact options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;
