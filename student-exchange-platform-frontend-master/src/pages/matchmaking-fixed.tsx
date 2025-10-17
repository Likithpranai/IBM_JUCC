import React, { useState } from 'react';
import '../styles/matchmaking.css';

// Types
interface University {
  id: number;
  name: string;
  country: string;
  ranking: number;
  matchScore: number;
  matchReason: string;
  creditTransfer: number;
  gpaRequirement: number;
  languageRequirement: string;
  programs: string[];
}

interface MatchResult {
  university: University;
  score: number;
  explanation: string;
}

interface StudentPreferences {
  universities: string[];
  gpa: number;
  major: string;
  languageTest: string;
  languageScore: number;
  interests: string[];
  extracurriculars: string;
  creditTransferCourses: string;
}

const MatchmakingPage: React.FC = () => {
  // State
  const [preferences, setPreferences] = useState<StudentPreferences>({
    universities: ['', '', '', '', '', '', '', '', '', ''], // 10 university choices
    gpa: 3.7,
    major: 'Computer Science',
    languageTest: 'IELTS',
    languageScore: 7.5,
    interests: ['Artificial Intelligence', 'Software Development', 'Data Science'],
    extracurriculars: 'Coding Club, Debate Team, Volunteer Work',
    creditTransferCourses: 'MATH 14100, PHYS 9010, CHEM 10100, BIOL 9010, ISOM 17700'
  });
  
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const [availableUniversities] = useState([
    'Massachusetts Institute of Technology (MIT)',
    'Stanford University',
    'University of Oxford',
    'University of Cambridge',
    'ETH Zurich',
    'Imperial College London',
    'University of Tokyo',
    'National University of Singapore',
    'University of California, Berkeley',
    'Harvard University',
    'University of Toronto',
    'University of British Columbia',
    'University of Melbourne',
    'University of Sydney',
    'University of Hong Kong'
  ]);
  
  // Handle university preference change
  const handleUniversityChange = (index: number, value: string) => {
    const updatedUniversities = [...preferences.universities];
    updatedUniversities[index] = value;
    setPreferences({
      ...preferences,
      universities: updatedUniversities
    });
  };
  
  // Handle GPA change
  const handleGpaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gpa = parseFloat(e.target.value);
    setPreferences({
      ...preferences,
      gpa: isNaN(gpa) ? 0 : Math.min(4.0, Math.max(0, gpa))
    });
  };
  
  // Handle major change
  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({
      ...preferences,
      major: e.target.value
    });
  };
  
  // Handle language test change
  const handleLanguageTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({
      ...preferences,
      languageTest: e.target.value
    });
  };
  
  // Handle language score change
  const handleLanguageScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseFloat(e.target.value);
    setPreferences({
      ...preferences,
      languageScore: isNaN(score) ? 0 : score
    });
  };
  
  // Handle interests change
  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(item => item.trim());
    setPreferences(prev => ({
      ...prev,
      interests
    }));
  };
  
  // Handle extracurriculars change
  const handleExtracurricularsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      extracurriculars: e.target.value
    }));
  };
  
  // Handle credit transfer courses change
  const handleCreditCoursesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      creditTransferCourses: e.target.value
    }));
  };
  
  // Helper function to get country from university name
  const getCountryFromUniversity = (uniName: string): string => {
    if (uniName.includes('MIT') || uniName.includes('Stanford') || uniName.includes('Harvard') || uniName.includes('California')) return 'United States';
    if (uniName.includes('Oxford') || uniName.includes('Cambridge') || uniName.includes('Imperial') || uniName.includes('London')) return 'United Kingdom';
    if (uniName.includes('ETH') || uniName.includes('Zurich')) return 'Switzerland';
    if (uniName.includes('Tokyo')) return 'Japan';
    if (uniName.includes('Singapore')) return 'Singapore';
    if (uniName.includes('Toronto') || uniName.includes('British Columbia')) return 'Canada';
    if (uniName.includes('Melbourne') || uniName.includes('Sydney')) return 'Australia';
    if (uniName.includes('Hong Kong')) return 'Hong Kong SAR';
    return 'Unknown';
  };
  
  // Helper function to get university ranking
  const getUniversityRanking = (uniName: string): number => {
    const rankings: {[key: string]: number} = {
      'Massachusetts Institute of Technology (MIT)': 1,
      'Stanford University': 2,
      'University of Oxford': 3,
      'University of Cambridge': 4,
      'ETH Zurich': 5,
      'Imperial College London': 6,
      'University of Tokyo': 7,
      'National University of Singapore': 8,
      'University of California, Berkeley': 9,
      'Harvard University': 10
    };
    
    return rankings[uniName] || Math.floor(Math.random() * 50) + 11;
  };
  
  // Helper function to generate relevant programs
  const generateRelevantPrograms = (major: string): string[] => {
    const programsByMajor: {[key: string]: string[]} = {
      'Computer Science': ['Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Data Science', 'Cybersecurity'],
      'Business': ['Business Administration', 'Finance', 'Marketing', 'International Business', 'Entrepreneurship'],
      'Engineering': ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering'],
      'Medicine': ['Medicine', 'Biomedical Sciences', 'Pharmacy', 'Public Health', 'Nursing'],
      'Arts': ['Fine Arts', 'Design', 'Music', 'Theater', 'Film Studies']
    };
    
    return programsByMajor[major] || ['General Studies', 'Liberal Arts', 'Interdisciplinary Studies'];
  };
  
  // Generate match explanation based on score and preferences
  const generateMatchExplanation = (uniName: string, score: number, prefs: StudentPreferences, rankPosition: number): string => {
    const rankText = rankPosition > -1 ? `This university was your #${rankPosition + 1} choice. ` : '';
    
    if (score >= 9) {
      return `${rankText}Excellent match! Your GPA of ${prefs.gpa} and ${prefs.languageTest} score of ${prefs.languageScore} exceed ${uniName}'s requirements. Your interests in ${prefs.interests.join(', ')} align perfectly with their strong ${prefs.major} program.`;
    } else if (score >= 7) {
      return `${rankText}Good match. Your academic profile meets ${uniName}'s requirements. Your background in ${prefs.interests[0]} and ${prefs.interests[1]} would be valuable for their ${prefs.major} program.`;
    } else {
      return `${rankText}Moderate match. Your ${prefs.languageTest} score of ${prefs.languageScore} meets the minimum, but your GPA of ${prefs.gpa} is slightly below their average. Consider highlighting your experience in ${prefs.interests[0]} to strengthen your application.`;
    }
  };
  
  // Generate match results using WatsonX SDK matcher
  const generateMatchResults = async () => {
    setIsLoading(true);
    
    try {
      // Filter out empty university preferences
      const selectedUniversities = preferences.universities.filter(uni => uni !== '');
      
      if (selectedUniversities.length === 0) {
        alert('Please select at least one university preference');
        setIsLoading(false);
        return;
      }
      
      // Prepare student data for the WatsonX SDK matcher
      const studentData = {
        'First Name': 'Student',
        'Last Name': 'User',
        'Sex': 'Not Specified',
        'Email': 'student@example.com',
        'GPA': preferences.gpa.toString(),
        'IELTS': preferences.languageTest === 'IELTS' ? preferences.languageScore.toString() : '0',
        'Top 10': selectedUniversities.join(', '),
        'Consent': 'Yes',
        'Extra Co-Curriculars': preferences.extracurriculars,
        'Credit Transfer Requirement': preferences.creditTransferCourses
      };
      
      // Make a real API call to the backend that uses WatsonX SDK
      console.log('Calling WatsonX API with student data:', studentData);
      
      // Call the API
      const response = await fetch('http://localhost:5001/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student: studentData }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received response from WatsonX API:', data);
      
      // Process API response
      const results: MatchResult[] = data.rankings.map((ranking: any) => {
        // Create university object from API data
        const university: University = {
          id: Math.floor(Math.random() * 1000), // Generate random ID
          name: ranking.university,
          country: getCountryFromUniversity(ranking.university),
          ranking: getUniversityRanking(ranking.university),
          matchScore: ranking.rank,
          matchReason: ranking.explanation,
          creditTransfer: Math.floor(Math.random() * 30) + 70, // Random credit transfer percentage
          gpaRequirement: ranking.details?.minGPA || 3.5,
          languageRequirement: `${ranking.details?.minIELTS || 7.0} (${preferences.languageTest})`,
          programs: generateRelevantPrograms(preferences.major)
        };
        
        return {
          university,
          score: ranking.rank,
          explanation: ranking.explanation
        };
      });
      
      // Sort results by match score (descending)
      results.sort((a, b) => b.score - a.score);
      
      setMatchResults(results);
      setIsMatched(true);
      setActiveTab('results');
    } catch (error) {
      console.error('Error generating match results:', error);
      alert('Error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="matchmaking-page">
      <div className="matchmaking-header">
        <h1>University Matchmaking</h1>
        <p>Our matchmaking system analyzes your academic profile and preferences to find the perfect university matches for your exchange program.</p>
      </div>
      
      <div className="matchmaking-content">
        <div className="matchmaking-tabs">
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
            disabled={isLoading}
          >
            Preferences
          </button>
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
            disabled={!isMatched || isLoading}
          >
            Match Results
          </button>
        </div>
        
        {activeTab === 'preferences' && (
          <div className="preferences-section">
            <div className="section-intro">
              <h2>Your Exchange Program Preferences</h2>
              <p>Tell us about your academic profile and university preferences to get personalized matches.</p>
            </div>
            
            <div className="university-preferences">
              <h3>University Preferences</h3>
              <p className="section-description">Rank your top 10 universities in order of preference. Your ranking will directly impact the match results.</p>
              
              <div className="university-ranking-list">
                {preferences.universities.map((uni, index) => (
                  <div className="university-rank-item" key={index}>
                    <div className="rank-number">{index + 1}</div>
                    <select 
                      className="university-select"
                      value={uni}
                      onChange={(e) => handleUniversityChange(index, e.target.value)}
                    >
                      <option value="">Select a university</option>
                      {availableUniversities.map((university, i) => (
                        <option key={i} value={university}>{university}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="academic-profile">
              <h3>Academic Profile</h3>
              <p className="section-description">Provide details about your academic background.</p>
              
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="gpa">GPA (0.0 - 4.0)</label>
                  <input 
                    type="number" 
                    id="gpa" 
                    className="form-control"
                    min="0"
                    max="4.0"
                    step="0.1"
                    value={preferences.gpa}
                    onChange={handleGpaChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="major">Major</label>
                  <select 
                    id="major" 
                    className="form-control"
                    value={preferences.major}
                    onChange={handleMajorChange}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business">Business</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="languageTest">Language Test</label>
                    <select 
                      id="languageTest" 
                      className="form-control"
                      value={preferences.languageTest}
                      onChange={handleLanguageTestChange}
                    >
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="languageScore">Score</label>
                    <input 
                      type="number" 
                      id="languageScore" 
                      className="form-control"
                      min="0"
                      step="0.1"
                      value={preferences.languageScore}
                      onChange={handleLanguageScoreChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="interests">Academic Interests (comma-separated)</label>
                  <input 
                    type="text" 
                    id="interests" 
                    className="form-control"
                    value={preferences.interests.join(', ')}
                    onChange={handleInterestsChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="extracurriculars">Extracurricular Activities</label>
                  <input 
                    type="text" 
                    id="extracurriculars" 
                    className="form-control"
                    value={preferences.extracurriculars}
                    onChange={handleExtracurricularsChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="creditCourses">Credit Transfer Courses</label>
                  <input 
                    type="text" 
                    id="creditCourses" 
                    className="form-control"
                    value={preferences.creditTransferCourses}
                    onChange={handleCreditCoursesChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary btn-generate"
                onClick={generateMatchResults}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Generating Matches...
                  </>
                ) : (
                  <>
                    Generate Match Results
                  </>
                )}
              </button>
            </div>
            
            {/* Powered-by section removed */}
          </div>
        )}
        
        {activeTab === 'results' && (
          <div className="results-section">
            <div className="results-header">
              <h2>Your University Matches</h2>
              <p className="results-description">
                Based on your academic profile and preferences, here are your personalized university matches.
                Each match includes a compatibility score and detailed explanation.
              </p>
            </div>
            
            {matchResults.length > 0 ? (
              <div className="match-results-list">
                {matchResults.map((result, index) => (
                  <div className="match-result-card" key={index}>
                    <div className="match-result-header">
                      <div className="match-score-container">
                        <div className={`match-score ${result.score >= 8 ? 'excellent' : result.score >= 6 ? 'good' : 'moderate'}`}>
                          {result.score}
                        </div>
                        <div className="match-label">Match</div>
                      </div>
                    </div>
                    
                    <div className="match-result-content">
                      <h3 className="university-name">{result.university.name}</h3>
                      <div className="university-meta">
                        <div className="university-country">{result.university.country}</div>
                        <div className="university-ranking">Global Rank #{result.university.ranking}</div>
                        {preferences.universities.findIndex(uni => uni === result.university.name) > -1 && (
                          <div className="user-preference">Your Choice #{preferences.universities.findIndex(uni => uni === result.university.name) + 1}</div>
                        )}
                      </div>
                      
                      <div className="match-explanation">
                        <h4>Match Analysis</h4>
                        <p>{result.explanation}</p>
                      </div>
                      
                      <div className="university-details">
                        <div className="detail-row">
                          <div className="detail-label">Minimum GPA</div>
                          <div className="detail-value">{result.university.gpaRequirement}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Language Requirement</div>
                          <div className="detail-value">{result.university.languageRequirement}</div>
                        </div>
                        <div className="detail-row">
                          <div className="detail-label">Credit Transfer</div>
                          <div className="detail-value">{result.university.creditTransfer}%</div>
                        </div>
                      </div>
                      
                      <div className="available-programs">
                        <h4>Available Programs</h4>
                        <div className="programs-list">
                          {result.university.programs.map((program, i) => (
                            <span className="program-tag" key={i}>{program}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="match-result-footer">
                      <button className="btn-secondary">View Details</button>
                      <button className="btn-primary">Apply Now →</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No Matches Found</h3>
                <p>Please update your preferences and try again.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab('preferences')}
                >
                  Update Preferences
                </button>
              </div>
            )}
            
            <div className="results-footer">
              <button 
                className="btn-secondary"
                onClick={() => setActiveTab('preferences')}
              >
                Back to Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchmakingPage;
