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

interface ExtraCurricular {
  activity: string;
  role: string;
  hours: number;
}

interface SocialMedia {
  linkedin: string;
  github: string;
  instagram: string;
}

const StudentProfile: React.FC = () => {
  // Mock student profile data
  const [profile, setProfile] = useState({
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
    interests: ['Hiking', 'Photography', 'Programming', 'Basketball'],
    languages: ['English', 'Cantonese', 'Mandarin'],
    extraCurriculars: [
      { activity: 'Robotics Club', role: 'President', hours: 120 },
      { activity: 'Volunteer Teaching', role: 'Tutor', hours: 80 },
      { activity: 'Hackathon', role: 'Participant', hours: 48 }
    ],
    socialMedia: {
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      instagram: 'instagram.com/johndoe'
    },
    bio: 'Computer Science student at HKUST with a passion for AI and software development. Looking forward to my exchange at UBC to explore new technologies and meet fellow tech enthusiasts.',
    photo: '/profile-placeholder.png',
    privacyConsent: true,
    sharingPreferences: {
      contactInfo: true,
      socialMedia: true,
      academicRecords: false
    }
  });

  // Document state
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Transcript.pdf',
      type: 'Academic Transcript',
      size: '2.4 MB',
      uploadDate: '2025-09-12',
      status: 'verified'
    },
    {
      id: '2',
      name: 'IELTS_Certificate.pdf',
      type: 'Language Certificate',
      size: '1.8 MB',
      uploadDate: '2025-09-15',
      status: 'verified'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'documents'
  const [newExtraCurricular, setNewExtraCurricular] = useState<ExtraCurricular>({
    activity: '',
    role: '',
    hours: 0
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile(editedProfile);
    }
    setIsEditing(!isEditing);
  };
  
  // Document upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: getDocumentType(file.name),
      size: formatFileSize(file.size),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'processing'
    };
    
    setDocuments([...documents, newDocument]);
    
    // Simulate processing and verification
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocument.id ? { ...doc, status: 'verified' } : doc
        )
      );
    }, 3000);
  };
  
  const getDocumentType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (fileName.includes('transcript')) return 'Academic Transcript';
    if (fileName.includes('ielts') || fileName.includes('toefl')) return 'Language Certificate';
    if (fileName.includes('statement') || fileName.includes('essay')) return 'Personal Statement';
    if (fileName.includes('cv') || fileName.includes('resume')) return 'CV/Resume';
    if (fileName.includes('recommendation') || fileName.includes('reference')) return 'Recommendation Letter';
    return 'Other Document';
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(item => item.trim());
    setEditedProfile({
      ...editedProfile,
      interests
    });
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languages = e.target.value.split(',').map(item => item.trim());
    setEditedProfile({
      ...editedProfile,
      languages
    });
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      socialMedia: {
        ...editedProfile.socialMedia,
        [name]: value
      }
    });
  };

  const handleExtraCurricularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExtraCurricular({
      ...newExtraCurricular,
      [name]: name === 'hours' ? parseInt(value) || 0 : value
    });
  };

  const addExtraCurricular = () => {
    if (newExtraCurricular.activity && newExtraCurricular.role) {
      setEditedProfile({
        ...editedProfile,
        extraCurriculars: [...editedProfile.extraCurriculars, newExtraCurricular]
      });
      setNewExtraCurricular({
        activity: '',
        role: '',
        hours: 0
      });
    }
  };

  const removeExtraCurricular = (index: number) => {
    const updatedExtraCurriculars = [...editedProfile.extraCurriculars];
    updatedExtraCurriculars.splice(index, 1);
    setEditedProfile({
      ...editedProfile,
      extraCurriculars: updatedExtraCurriculars
    });
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'privacyConsent') {
      setEditedProfile({
        ...editedProfile,
        privacyConsent: checked
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        sharingPreferences: {
          ...editedProfile.sharingPreferences,
          [name]: checked
        }
      });
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Student Profile</h1>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
          
          <div className="profile-title">
            <h2>{profile.name}</h2>
            <p>{profile.university} • {profile.major}</p>
          </div>
          
          <div className="profile-actions">
            <button 
              className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Personal Information
          </button>
          <button 
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'info' ? (
            <>
              <div className="profile-section">
                <h3>Personal Information</h3>
                
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name" 
                        value={editedProfile.name} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.name}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>Email</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={editedProfile.email} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        name="phone" 
                        value={editedProfile.phone} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.phone}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>University</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="university" 
                        value={editedProfile.university} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.university}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>Major</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="major" 
                        value={editedProfile.major} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.major}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>Year</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        name="year" 
                        value={editedProfile.year} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.year}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>GPA</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        step="0.1" 
                        name="gpa" 
                        value={editedProfile.gpa} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.gpa}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>IELTS Score</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        step="0.5" 
                        name="ieltsScore" 
                        value={editedProfile.ieltsScore} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.ieltsScore}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>TOEFL Score</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        name="toeflScore" 
                        value={editedProfile.toeflScore || ''} 
                        onChange={handleInputChange} 
                        placeholder="Optional"
                      />
                    ) : (
                      <p>{profile.toeflScore || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Exchange Information</h3>
                
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Exchange Destination</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="exchangeDestination" 
                        value={editedProfile.exchangeDestination} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.exchangeDestination}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>Exchange Period</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="exchangePeriod" 
                        value={editedProfile.exchangePeriod} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <p>{profile.exchangePeriod}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Extra-Curricular Activities</h3>
                
                <div className="extracurricular-list">
                  {(isEditing ? editedProfile.extraCurriculars : profile.extraCurriculars).map((item, index) => (
                    <div key={index} className="extracurricular-item">
                      <div className="extracurricular-details">
                        <div className="extracurricular-activity">{item.activity}</div>
                        <div className="extracurricular-role">{item.role}</div>
                        <div className="extracurricular-hours">{item.hours} hours</div>
                      </div>
                      {isEditing && (
                        <button 
                          className="btn-remove" 
                          onClick={() => removeExtraCurricular(index)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div className="add-extracurricular">
                      <h4>Add Activity</h4>
                      <div className="extracurricular-form">
                        <input
                          type="text"
                          name="activity"
                          placeholder="Activity Name"
                          value={newExtraCurricular.activity}
                          onChange={handleExtraCurricularChange}
                        />
                        <input
                          type="text"
                          name="role"
                          placeholder="Your Role"
                          value={newExtraCurricular.role}
                          onChange={handleExtraCurricularChange}
                        />
                        <input
                          type="number"
                          name="hours"
                          placeholder="Hours"
                          value={newExtraCurricular.hours || ''}
                          onChange={handleExtraCurricularChange}
                        />
                        <button className="btn-add" onClick={addExtraCurricular}>Add</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Interests & Languages</h3>
                
                <div className="profile-grid">
                  <div className="profile-field full-width">
                    <label>Interests</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="interests" 
                        value={editedProfile.interests.join(', ')} 
                        onChange={handleInterestsChange} 
                        placeholder="Separate interests with commas"
                      />
                    ) : (
                      <div className="tag-list">
                        {profile.interests.map((interest, index) => (
                          <span className="tag" key={index}>{interest}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="profile-field full-width">
                    <label>Languages</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="languages" 
                        value={editedProfile.languages.join(', ')} 
                        onChange={handleLanguagesChange} 
                        placeholder="Separate languages with commas"
                      />
                    ) : (
                      <div className="tag-list">
                        {profile.languages.map((language, index) => (
                          <span className="tag" key={index}>{language}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Social Media</h3>
                
                <div className="profile-grid">
                  <div className="profile-field">
                    <label>LinkedIn</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="linkedin" 
                        value={editedProfile.socialMedia.linkedin} 
                        onChange={handleSocialMediaChange} 
                      />
                    ) : (
                      <p>{profile.socialMedia.linkedin}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>GitHub</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="github" 
                        value={editedProfile.socialMedia.github} 
                        onChange={handleSocialMediaChange} 
                      />
                    ) : (
                      <p>{profile.socialMedia.github}</p>
                    )}
                  </div>
                  
                  <div className="profile-field">
                    <label>Instagram</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="instagram" 
                        value={editedProfile.socialMedia.instagram} 
                        onChange={handleSocialMediaChange} 
                      />
                    ) : (
                      <p>{profile.socialMedia.instagram}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Bio</h3>
                
                <div className="profile-field full-width">
                  {isEditing ? (
                    <textarea 
                      name="bio" 
                      value={editedProfile.bio} 
                      onChange={handleInputChange} 
                      rows={4}
                    />
                  ) : (
                    <p className="profile-bio">{profile.bio}</p>
                  )}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Privacy Settings</h3>
                
                <div className="profile-field full-width">
                  <div className="privacy-settings">
                    <div className="privacy-option">
                      <label>
                        <input 
                          type="checkbox" 
                          name="privacyConsent"
                          checked={editedProfile.privacyConsent}
                          onChange={handlePrivacyChange}
                          disabled={!isEditing}
                        /> 
                        I consent to share my information for exchange program matching purposes
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <label>
                        <input 
                          type="checkbox" 
                          name="contactInfo"
                          checked={editedProfile.sharingPreferences.contactInfo}
                          onChange={handlePrivacyChange}
                          disabled={!isEditing}
                        /> 
                        Share my contact information with matched connections
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <label>
                        <input 
                          type="checkbox" 
                          name="socialMedia"
                          checked={editedProfile.sharingPreferences.socialMedia}
                          onChange={handlePrivacyChange}
                          disabled={!isEditing}
                        /> 
                        Share my social media profiles with matched connections
                      </label>
                    </div>
                    
                    <div className="privacy-option">
                      <label>
                        <input 
                          type="checkbox" 
                          name="academicRecords"
                          checked={editedProfile.sharingPreferences.academicRecords}
                          onChange={handlePrivacyChange}
                          disabled={!isEditing}
                        /> 
                        Allow IBM WatsonX to analyze my academic records for better matches
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="documents-section">
              <h3>My Documents</h3>
              <p className="documents-description">
                Upload your documents for the exchange program application. 
                We recommend uploading your academic transcript, language certificates, 
                personal statement, and any other relevant documents.
              </p>
              
              <div className="document-upload-area">
                <label htmlFor="document-upload" className="upload-label">
                  <div className="upload-icon">📄</div>
                  <div className="upload-text">
                    <span className="upload-title">Upload Document</span>
                    <span className="upload-subtitle">Click to browse or drag and drop</span>
                  </div>
                </label>
                <input 
                  id="document-upload" 
                  type="file" 
                  className="document-input" 
                  onChange={handleFileUpload}
                />
              </div>
              
              <div className="documents-list">
                <div className="documents-header">
                  <div className="document-name-header">Document Name</div>
                  <div className="document-type-header">Type</div>
                  <div className="document-size-header">Size</div>
                  <div className="document-date-header">Upload Date</div>
                  <div className="document-status-header">Status</div>
                  <div className="document-actions-header">Actions</div>
                </div>
                
                {documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-name">
                      <span className="document-icon">📄</span>
                      {doc.name}
                    </div>
                    <div className="document-type">{doc.type}</div>
                    <div className="document-size">{doc.size}</div>
                    <div className="document-date">{doc.uploadDate}</div>
                    <div className={`document-status ${doc.status}`}>
                      {doc.status === 'verified' && '✓ Verified'}
                      {doc.status === 'processing' && '⏳ Processing'}
                      {doc.status === 'uploaded' && '📤 Uploaded'}
                    </div>
                    <div className="document-actions">
                      <button className="btn-view">View</button>
                      <button 
                        className="btn-delete" 
                        onClick={() => deleteDocument(doc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                
                {documents.length === 0 && (
                  <div className="no-documents">
                    <p>No documents uploaded yet.</p>
                  </div>
                )}
              </div>
              
              <div className="document-tips">
                <h4>Tips for Document Submission</h4>
                <ul>
                  <li>All documents should be in PDF format</li>
                  <li>Maximum file size: 10MB per document</li>
                  <li>Make sure all text is clearly legible</li>
                  <li>Official transcripts should include your university's seal or watermark</li>
                  <li>Language certificates must be valid (not expired)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-footer">
          <div className="ai-badge">
            <span className="ai-icon">🧠</span>
            <span className="ai-text">Powered by IBM WatsonX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
