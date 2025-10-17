import React, { useState } from 'react';
import '../styles/profile.css';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'verified';
}

const StudentProfile: React.FC = () => {
  // Mock student profile data
  const [profile] = useState({
    name: 'John Doe',
    email: 'johndoe@connect.ust.hk',
    phone: '+852 9123 4567',
    university: 'HKUST',
    major: 'Computer Science',
    year: 3,
    gpa: 3.8,
    ieltsScore: 7.5,
    toeflScore: null as number | null,
    exchangeDestination: 'University of British Columbia',
    exchangePeriod: 'Spring 2026',
    interests: ['Artificial Intelligence', 'Software Development', 'Data Science'],
    languages: ['English', 'Cantonese', 'Mandarin'],
    bio: 'Computer Science student at HKUST with a passion for AI and software development.'
  });

  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Transcript.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2025-09-15',
      status: 'verified'
    },
    {
      id: '2',
      name: 'Passport.jpg',
      type: 'JPG',
      size: '1.2 MB',
      uploadDate: '2025-09-14',
      status: 'verified'
    },
    {
      id: '3',
      name: 'Recommendation_Letter.pdf',
      type: 'PDF',
      size: '0.8 MB',
      uploadDate: '2025-09-16',
      status: 'processing'
    }
  ]);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Student Profile</h1>
          <p>Manage your personal information and exchange program documents</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <div className="info-value">{profile.name}</div>
              </div>
              <div className="info-item">
                <label>Email</label>
                <div className="info-value">{profile.email}</div>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <div className="info-value">{profile.phone}</div>
              </div>
              <div className="info-item">
                <label>University</label>
                <div className="info-value">{profile.university}</div>
              </div>
              <div className="info-item">
                <label>Major</label>
                <div className="info-value">{profile.major}</div>
              </div>
              <div className="info-item">
                <label>Year</label>
                <div className="info-value">{profile.year}</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Academic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>GPA</label>
                <div className="info-value">{profile.gpa}</div>
              </div>
              <div className="info-item">
                <label>IELTS Score</label>
                <div className="info-value">{profile.ieltsScore}</div>
              </div>
              <div className="info-item">
                <label>TOEFL Score</label>
                <div className="info-value">{profile.toeflScore || 'N/A'}</div>
              </div>
              <div className="info-item">
                <label>Exchange Destination</label>
                <div className="info-value">{profile.exchangeDestination}</div>
              </div>
              <div className="info-item">
                <label>Exchange Period</label>
                <div className="info-value">{profile.exchangePeriod}</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Interests & Languages</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Academic Interests</label>
                <div className="info-value">
                  <div className="tags">
                    {profile.interests.map((interest, index) => (
                      <span key={index} className="tag">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="info-item">
                <label>Languages</label>
                <div className="info-value">
                  <div className="tags">
                    {profile.languages.map((language, index) => (
                      <span key={index} className="tag">{language}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Documents</h2>
            <div className="documents-list">
              {documents.length > 0 ? (
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Upload Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td>{doc.name}</td>
                        <td>{doc.type}</td>
                        <td>{doc.size}</td>
                        <td>{doc.uploadDate}</td>
                        <td>
                          <span className={`status-badge ${doc.status}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-documents">
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
