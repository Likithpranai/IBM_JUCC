import React, { useState } from 'react';
import '../styles/university-matching.css';

const UniversityMatching: React.FC = () => {
  // Mock student data
  const studentProfile = {
    name: 'John Doe',
    gpa: 3.8,
    ielts: 7.5,
    extracurriculars: 'Chess Club (Member), Music Club (Member), Sports Team (Member)',
    creditTransfer: 'ECON 9010, MGMT 14100, ENGL 9010, PSYC 9100, ISOM 16700'
  };

  // Mock university rankings data
  const initialUniversities = [
    {
      name: 'University of British Columbia',
      score: 9.5,
      explanation: 'Your GPA of 3.8 exceeds UBC\'s minimum requirement of 3.0. Your IELTS score of 7.5 also exceeds the minimum requirement of 6.5. You have participated in multiple extracurricular activities, meeting UBC\'s requirement of at least one activity. Your credit transfer courses align well with UBC\'s business program requirements.',
      minGpa: 3.0,
      minIelts: 6.5,
      location: 'Vancouver, Canada',
      programs: ['Computer Science', 'Business', 'Engineering'],
      strengths: ['Research Opportunities', 'Campus Life', 'International Community']
    },
    {
      name: 'University of Tokyo',
      score: 9.0,
      explanation: 'Your GPA of 3.8 exceeds Tokyo\'s minimum requirement of 3.3. Your IELTS score of 7.5 exceeds the minimum requirement of 7.0. Your extracurricular activities meet the university\'s requirement of two activities. Some of your credit transfer courses align with Tokyo\'s business program.',
      minGpa: 3.3,
      minIelts: 7.0,
      location: 'Tokyo, Japan',
      programs: ['Engineering', 'Science', 'Economics'],
      strengths: ['Research Excellence', 'Cultural Experience', 'Academic Rigor']
    },
    {
      name: 'Stanford University',
      score: 8.5,
      explanation: 'Your GPA of 3.8 meets Stanford\'s minimum requirement of 3.8. Your IELTS score of 7.5 is close to the minimum requirement of 8.0. You have participated in multiple extracurricular activities, meeting Stanford\'s requirement. Your credit transfer courses partially align with Stanford\'s business program requirements.',
      minGpa: 3.8,
      minIelts: 8.0,
      location: 'California, USA',
      programs: ['Computer Science', 'Engineering', 'Business'],
      strengths: ['Innovation', 'Silicon Valley Connections', 'Research Opportunities']
    },
    {
      name: 'University of Oxford',
      score: 8.0,
      explanation: 'Your GPA of 3.8 exceeds Oxford\'s minimum requirement of 3.7. Your IELTS score of 7.5 meets the minimum requirement of 7.5. Your extracurricular activities meet the university\'s requirement of two activities. Some of your credit transfer courses align with Oxford\'s program requirements.',
      minGpa: 3.7,
      minIelts: 7.5,
      location: 'Oxford, UK',
      programs: ['Philosophy', 'Economics', 'Computer Science'],
      strengths: ['Academic Excellence', 'Tutorial System', 'Historic Environment']
    },
    {
      name: 'National University of Singapore',
      score: 8.0,
      explanation: 'Your GPA of 3.8 exceeds NUS\'s minimum requirement of 3.2. Your IELTS score of 7.5 exceeds the minimum requirement of 6.5. Your extracurricular activities meet the university\'s requirement of two activities. Your credit transfer courses align well with NUS\'s business program requirements.',
      minGpa: 3.2,
      minIelts: 6.5,
      location: 'Singapore',
      programs: ['Business', 'Engineering', 'Computer Science'],
      strengths: ['Global Perspective', 'Industry Connections', 'Modern Facilities']
    }
  ];

  const [universities, setUniversities] = useState(initialUniversities);
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [filterGPA, setFilterGPA] = useState<number | ''>('');
  const [filterIELTS, setFilterIELTS] = useState<number | ''>('');

  const handleUniversityClick = (university: any) => {
    setSelectedUniversity(university);
  };

  const handleFilterApply = () => {
    let filtered = [...initialUniversities];
    
    if (filterGPA !== '') {
      filtered = filtered.filter(uni => uni.minGpa <= filterGPA);
    }
    
    if (filterIELTS !== '') {
      filtered = filtered.filter(uni => uni.minIelts <= filterIELTS);
    }
    
    setUniversities(filtered);
  };

  const handleFilterReset = () => {
    setFilterGPA('');
    setFilterIELTS('');
    setUniversities(initialUniversities);
  };

  return (
    <div className="university-matching">
      <h1 className="page-title">University Matching</h1>
      
      <div className="university-matching-container">
        <div className="university-sidebar">
          <div className="student-profile-card">
            <h2>Your Profile</h2>
            <div className="profile-details">
              <div className="profile-item">
                <span className="profile-label">GPA</span>
                <span className="profile-value">{studentProfile.gpa}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">IELTS</span>
                <span className="profile-value">{studentProfile.ielts}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Extracurriculars</span>
                <span className="profile-value">{studentProfile.extracurriculars}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Credit Transfer</span>
                <span className="profile-value">{studentProfile.creditTransfer}</span>
              </div>
            </div>
          </div>
          
          <div className="filter-card">
            <h2>Filters</h2>
            <div className="filter-form">
              <div className="form-group">
                <label htmlFor="gpaFilter">Minimum GPA</label>
                <input
                  type="number"
                  id="gpaFilter"
                  min="0"
                  max="4.0"
                  step="0.1"
                  value={filterGPA}
                  onChange={(e) => setFilterGPA(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="Any"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ieltsFilter">Minimum IELTS</label>
                <input
                  type="number"
                  id="ieltsFilter"
                  min="0"
                  max="9.0"
                  step="0.5"
                  value={filterIELTS}
                  onChange={(e) => setFilterIELTS(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="Any"
                />
              </div>
              
              <div className="filter-actions">
                <button className="btn btn-primary" onClick={handleFilterApply}>Apply</button>
                <button className="btn btn-secondary" onClick={handleFilterReset}>Reset</button>
              </div>
            </div>
          </div>
          
          <div className="ai-badge">
            <span className="ai-icon">🧠</span>
            <span className="ai-text">Powered by IBM WatsonX</span>
          </div>
        </div>
        
        <div className="university-content">
          <div className="university-list">
            <h2>University Rankings</h2>
            <p className="university-list-subtitle">Based on your academic profile and preferences</p>
            
            {universities.length === 0 ? (
              <div className="no-results">
                <p>No universities match your filter criteria.</p>
              </div>
            ) : (
              universities.map((university, index) => (
                <div 
                  className={`university-item ${selectedUniversity === university ? 'selected' : ''}`} 
                  key={index}
                  onClick={() => handleUniversityClick(university)}
                >
                  <div className="university-rank">{index + 1}</div>
                  <div className="university-info">
                    <h3>{university.name}</h3>
                    <p className="university-location">{university.location}</p>
                    <div className="university-requirements">
                      <span className="requirement">Min GPA: {university.minGpa}</span>
                      <span className="requirement">Min IELTS: {university.minIelts}</span>
                    </div>
                  </div>
                  <div className="university-score">
                    <span className="score">{university.score}</span>
                    <span className="score-max">/10</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="university-details">
            {selectedUniversity ? (
              <>
                <div className="university-header">
                  <h2>{selectedUniversity.name}</h2>
                  <div className="university-score">
                    <span className="score">{selectedUniversity.score}</span>
                    <span className="score-max">/10</span>
                  </div>
                </div>
                
                <div className="university-location">
                  <i className="location-icon">📍</i>
                  <span>{selectedUniversity.location}</span>
                </div>
                
                <div className="university-section">
                  <h3>Match Explanation</h3>
                  <p>{selectedUniversity.explanation}</p>
                </div>
                
                <div className="university-section">
                  <h3>Available Programs</h3>
                  <div className="tag-list">
                    {selectedUniversity.programs.map((program: string, index: number) => (
                      <span className="tag" key={index}>{program}</span>
                    ))}
                  </div>
                </div>
                
                <div className="university-section">
                  <h3>University Strengths</h3>
                  <div className="strength-list">
                    {selectedUniversity.strengths.map((strength: string, index: number) => (
                      <div className="strength-item" key={index}>
                        <i className="strength-icon">✓</i>
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="university-actions">
                  <button className="btn btn-primary">Add to Favorites</button>
                  <button className="btn btn-secondary">View Connections</button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎓</div>
                <h3>Select a University</h3>
                <p>Click on a university from the list to view detailed information and match analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityMatching;
