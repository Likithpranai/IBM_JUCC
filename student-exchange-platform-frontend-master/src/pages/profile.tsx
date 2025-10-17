import React, { useState, useRef, ChangeEvent } from 'react';
import '../styles/profile.css';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'verified';
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  year: number;
  gpa: number;
  ieltsScore: number | null;
  toeflScore: number | null;
  exchangeDestination: string;
  exchangePeriod: string;
  interests: string[];
  languages: string[];
  bio: string;
}

const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock student profile data
  const [profile, setProfile] = useState<ProfileData>({
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

  const [documents, setDocuments] = useState<Document[]>([
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle numeric input changes with validation
  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? null : parseFloat(value);
    setProfile(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save profile changes
  const saveChanges = () => {
    setIsEditing(false);
    // Here you would typically send the updated profile to your backend
    alert('Profile updated successfully!');
  };

  // Add a new interest
  const addInterest = () => {
    if (newInterest && !profile.interests.includes(newInterest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest]
      }));
      setNewInterest('');
    }
  };

  // Remove an interest
  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  // Add a new language
  const addLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  // Remove a language
  const removeLanguage = (language: string) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }
    
    // Create a new document object
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'uploaded'
    };
    
    // Add the new document to the list
    setDocuments(prev => [...prev, newDocument]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Here you would typically upload the file to your backend
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocument.id ? { ...doc, status: 'processing' } : doc
        )
      );
      
      // Simulate verification after 3 seconds
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDocument.id ? { ...doc, status: 'verified' } : doc
          )
        );
      }, 3000);
    }, 1500);
  };

  // Delete a document
  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="header-content">
            <h1>Student Profile</h1>
            <p>Manage your personal information and exchange program documents</p>
          </div>
          <div className="header-actions">
            {isEditing ? (
              <>
                <button className="btn-cancel" onClick={toggleEditMode}>Cancel</button>
                <button className="btn-save" onClick={saveChanges}>Save Changes</button>
              </>
            ) : (
              <button className="btn-edit" onClick={toggleEditMode}>Edit Profile</button>
            )}
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-left">
            <div className="profile-photo">
              <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="Profile" />
            </div>
            <button className="btn-change-photo" disabled={!isEditing}>
              Change Photo
            </button>
          </div>
          <div className="profile-card-right">
            <div className="profile-name">{profile.name}</div>
            <div className="profile-university">{profile.university}</div>
            <div className="profile-details">
              <div className="profile-detail">
                <span className="detail-label">Major:</span>
                <span className="detail-value">{profile.major}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">Year:</span>
                <span className="detail-value">{profile.year}</span>
              </div>
              <div className="profile-detail">
                <span className="detail-label">GPA:</span>
                <span className="detail-value">{profile.gpa}</span>
              </div>
            </div>
            <div className="profile-bio">
              {profile.bio}
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="name">Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.name}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="email">Email</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={profile.email} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.email}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="phone">Phone</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    id="phone" 
                    name="phone" 
                    value={profile.phone} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.phone}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="university">University</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    id="university" 
                    name="university" 
                    value={profile.university} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.university}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="major">Major</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    id="major" 
                    name="major" 
                    value={profile.major} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.major}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="year">Year</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="year" 
                    name="year" 
                    value={profile.year} 
                    onChange={handleNumericInputChange} 
                    className="form-input"
                    min="1" 
                    max="7"
                  />
                ) : (
                  <div className="info-value">{profile.year}</div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Academic Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="gpa">GPA</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="gpa" 
                    name="gpa" 
                    value={profile.gpa} 
                    onChange={handleNumericInputChange} 
                    className="form-input"
                    min="0" 
                    max="4.3"
                    step="0.1"
                  />
                ) : (
                  <div className="info-value">{profile.gpa}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="ieltsScore">IELTS Score</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="ieltsScore" 
                    name="ieltsScore" 
                    value={profile.ieltsScore || ''} 
                    onChange={handleNumericInputChange} 
                    className="form-input"
                    min="0" 
                    max="9"
                    step="0.5"
                  />
                ) : (
                  <div className="info-value">{profile.ieltsScore || 'N/A'}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="toeflScore">TOEFL Score</label>
                {isEditing ? (
                  <input 
                    type="number" 
                    id="toeflScore" 
                    name="toeflScore" 
                    value={profile.toeflScore || ''} 
                    onChange={handleNumericInputChange} 
                    className="form-input"
                    min="0" 
                    max="120"
                    step="1"
                  />
                ) : (
                  <div className="info-value">{profile.toeflScore || 'N/A'}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="exchangeDestination">Exchange Destination</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    id="exchangeDestination" 
                    name="exchangeDestination" 
                    value={profile.exchangeDestination} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.exchangeDestination}</div>
                )}
              </div>
              <div className="info-item">
                <label htmlFor="exchangePeriod">Exchange Period</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    id="exchangePeriod" 
                    name="exchangePeriod" 
                    value={profile.exchangePeriod} 
                    onChange={handleInputChange} 
                    className="form-input"
                  />
                ) : (
                  <div className="info-value">{profile.exchangePeriod}</div>
                )}
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
                      <span key={index} className="tag">
                        {interest}
                        {isEditing && (
                          <button 
                            type="button" 
                            className="tag-remove" 
                            onClick={() => removeInterest(interest)}
                          >
                            Remove
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="tag-input-container">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add new interest"
                        className="tag-input"
                      />
                      <button 
                        type="button" 
                        onClick={addInterest} 
                        className="tag-add"
                        disabled={!newInterest}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="info-item">
                <label>Languages</label>
                <div className="info-value">
                  <div className="tags">
                    {profile.languages.map((language, index) => (
                      <span key={index} className="tag">
                        {language}
                        {isEditing && (
                          <button 
                            type="button" 
                            className="tag-remove" 
                            onClick={() => removeLanguage(language)}
                          >
                            Remove
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="tag-input-container">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add new language"
                        className="tag-input"
                      />
                      <button 
                        type="button" 
                        onClick={addLanguage} 
                        className="tag-add"
                        disabled={!newLanguage}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2>Documents</h2>
              <button type="button" className="btn-upload" onClick={triggerFileInput}>
                Upload Document
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
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
                      <th>Actions</th>
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
                            {doc.status === 'uploaded' && 'Uploaded'}
                            {doc.status === 'processing' && 'Processing'}
                            {doc.status === 'verified' && 'Verified'}
                          </span>
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn-delete" 
                            onClick={() => deleteDocument(doc.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-documents">
                  <p>No documents uploaded yet.</p>
                  <p>Click the "Upload Document" button to add documents.</p>
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
