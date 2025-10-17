import React from 'react';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  // Mock data for dashboard
  const studentInfo = {
    name: 'John Doe',
    university: 'HKUST',
    major: 'Computer Science',
    exchangeDestination: 'University of British Columbia',
    exchangePeriod: 'Spring 2026',
    gpa: 3.8,
    ieltsScore: 7.5
  };

  const topUniversities = [
    { name: 'University of British Columbia', score: 9.5, explanation: 'Excellent match based on academic profile and interests.' },
    { name: 'University of Tokyo', score: 9.0, explanation: 'Strong match with your academic background.' },
    { name: 'Stanford University', score: 8.5, explanation: 'Good match but highly competitive admission.' }
  ];

  const recentConnections = [
    { name: 'Sarah Chen', university: 'University of Oxford', type: 'Exchange Student', time: '2 days ago' },
    { name: 'Dr. James Wong', university: 'University of British Columbia', type: 'Alumni', time: '1 week ago' },
    { name: 'Thomas Cheung', university: 'University of British Columbia', type: 'Past Exchange Student', time: '3 weeks ago' }
  ];

  const upcomingDeadlines = [
    { title: 'UBC Application Deadline', date: '2025-11-15', daysLeft: 30 },
    { title: 'Scholarship Application', date: '2025-12-01', daysLeft: 46 },
    { title: 'Housing Application', date: '2025-12-15', daysLeft: 60 }
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <div className="welcome-header">
            <h2>Welcome back, {studentInfo.name}</h2>
            <div className="ibm-badge">
              <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H32V3H0V0ZM0 6.5H32V9.5H0V6.5ZM0 13H32V16H0V13Z" fill="#0F62FE"/>
              </svg>
              <span>IBM WatsonX</span>
            </div>
          </div>
          <p className="welcome-subtitle">Here's your exchange program status and recommendations.</p>
        </div>
        <div className="welcome-stats">
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>Exchange Destination</h3>
              <p>{studentInfo.exchangeDestination}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Exchange Period</h3>
              <p>{studentInfo.exchangePeriod}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card university-matches">
          <div className="card-header">
            <h2 className="card-title">Top University Matches</h2>
            <a href="/university-matching" className="card-link">View All</a>
          </div>
          <div className="university-list">
            {topUniversities.map((uni, index) => (
              <div className="university-item" key={index}>
                <div className="university-rank">{index + 1}</div>
                <div className="university-info">
                  <h3>{uni.name}</h3>
                  <p>{uni.explanation}</p>
                </div>
                <div className="university-score">
                  <span className="score">{uni.score}</span>
                  <span className="score-max">/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card recent-connections">
          <div className="card-header">
            <h2 className="card-title">Recent Connections</h2>
            <a href="/connections" className="card-link">View All</a>
          </div>
          <div className="connection-list">
            {recentConnections.map((connection, index) => (
              <div className="connection-item" key={index}>
                <div className="connection-avatar">
                  {connection.name.charAt(0)}
                </div>
                <div className="connection-info">
                  <h3>{connection.name}</h3>
                  <p>{connection.university}</p>
                  <span className="connection-type">{connection.type}</span>
                </div>
                <div className="connection-time">
                  {connection.time}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card student-profile">
          <div className="card-header">
            <h2 className="card-title">Your Profile</h2>
            <a href="/profile" className="card-link">Edit</a>
          </div>
          <div className="profile-details">
            <div className="profile-item">
              <span className="profile-label">University</span>
              <span className="profile-value">{studentInfo.university}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">Major</span>
              <span className="profile-value">{studentInfo.major}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">GPA</span>
              <span className="profile-value">{studentInfo.gpa}</span>
            </div>
            <div className="profile-item">
              <span className="profile-label">IELTS Score</span>
              <span className="profile-value">{studentInfo.ieltsScore}</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card deadlines">
          <div className="card-header">
            <h2 className="card-title">Upcoming Deadlines</h2>
          </div>
          <div className="deadline-list">
            {upcomingDeadlines.map((deadline, index) => (
              <div className="deadline-item" key={index}>
                <div className="deadline-info">
                  <h3>{deadline.title}</h3>
                  <p>{deadline.date}</p>
                </div>
                <div className="deadline-countdown">
                  <span className={deadline.daysLeft < 15 ? 'urgent' : ''}>
                    {deadline.daysLeft} days left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="dashboard-footer">
        <div className="ai-badge">
          <span className="ai-icon">🧠</span>
          <span className="ai-text">Powered by IBM WatsonX</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
