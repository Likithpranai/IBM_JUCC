import React, { useState, useEffect } from 'react';
import '../styles/matchmaking.css';

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
  image: string;
}

interface MatchResult {
  university: University;
  score: number;
  explanation: string;
}

const Matchmaking: React.FC = () => {
  const [preferences, setPreferences] = useState({
    universities: ['', '', '', '', '', '', '', '', '', ''],
    major: 'Computer Science',
    gpa: 3.8,
    languageScore: 7.5,
    languageTest: 'IELTS',
    interests: ['Artificial Intelligence', 'Data Science', 'Software Engineering']
  });

  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');

  // Available universities for selection
  const availableUniversities = [
    'Massachusetts Institute of Technology (MIT)',
    'Stanford University',
    'University of Oxford',
    'University of Cambridge',
    'ETH Zurich',
    'Imperial College London',
    'University of Tokyo',
    'National University of Singapore',
    'University of Toronto',
    'Tsinghua University',
    'Peking University',
    'University of Melbourne',
    'Technical University of Munich',
    'Seoul National University',
    'University of Hong Kong',
    'Sorbonne University',
    'University of Sydney',
    'Nanyang Technological University',
    'University of British Columbia',
    'London School of Economics'
  ].sort();

  // Available majors for selection
  const availableMajors = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Business Administration',
    'Economics',
    'Finance',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Medicine',
    'Law',
    'Psychology',
    'Sociology',
    'Political Science',
    'International Relations',
    'Architecture',
    'Design'
  ].sort();

  // Handle preference changes
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle university preference change
  const handleUniversityChange = (index: number, value: string) => {
    const newUniversities = [...preferences.universities];
    newUniversities[index] = value;
    setPreferences(prev => ({
      ...prev,
      universities: newUniversities
    }));
  };

  // Handle interests change
  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(item => item.trim());
    setPreferences(prev => ({
      ...prev,
      interests
    }));
  };

  // Generate match results using IBM WatsonX API
  const generateMatchResults = async () => {
    setIsLoading(true);
    
    try {
      // Filter out empty university preferences
      const selectedUniversities = preferences.universities.filter(uni => uni !== '');
      
      if (selectedUniversities.length === 0) {
        alert('Please select at least one university');
        setIsLoading(false);
        return;
      }
      
      // Prepare student data for the API
      const studentData = {
        "First Name": "John", // In a real app, this would come from the user profile
        "Last Name": "Doe",
        "GPA": preferences.gpa.toString(),
        "IELTS": preferences.languageScore.toString(),
        "Extra Co-Curriculars": preferences.interests.map(interest => `${interest} -> (Participant)`).join(', '),
        "Credit Transfer Requirement": "MATH 14100, PHYS 9010, CHEM 10100, BIOL 9010, ISOM 17700", // Example courses
        "Top 10": selectedUniversities.join(', ')
      };
      
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
      
      // Process API response
      const results: MatchResult[] = data.rankings.map((ranking: any) => {
        // Create university object from API data
        const university: University = {
          id: Math.floor(Math.random() * 1000), // Generate random ID
          name: ranking.university,
          country: getCountryFromUniversity(ranking.university),
          ranking: getUniversityRanking(ranking.university),
          matchScore: ranking.score,
          matchReason: ranking.explanation,
          creditTransfer: Math.floor(Math.random() * 30) + 70, // Random credit transfer percentage
          gpaRequirement: ranking.details?.minGPA || 3.5,
          languageRequirement: `${ranking.details?.minIELTS || 7.0} (${preferences.languageTest})`,
          programs: generateRelevantPrograms(preferences.major),
          image: getUniversityImage(ranking.university)
        };
        
        return {
          university,
          score: ranking.score,
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
      alert('Error connecting to the WatsonX API. Using simulated results instead.');
      
      // Fallback to simulated results if API fails
      generateSimulatedResults();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback function for simulated results
  const generateSimulatedResults = () => {
    const results: MatchResult[] = [];
    
    // Filter out empty university preferences
    const selectedUniversities = preferences.universities.filter(uni => uni !== '');
    
    // Generate match results for each selected university
    selectedUniversities.forEach((uniName, index) => {
      // Generate a realistic match score based on simulated factors
      const baseScore = Math.random() * 3 + 7; // Base score between 7-10
      const gpaFactor = preferences.gpa >= 3.7 ? 0 : -1; // Penalty for lower GPA
      const languageFactor = preferences.languageScore >= 7.0 ? 0 : -0.5; // Penalty for lower language score
      
      // Calculate final score (out of 10)
      const finalScore = Math.min(10, Math.max(1, baseScore + gpaFactor + languageFactor));
      const roundedScore = Math.round(finalScore * 10) / 10;
      
      // Generate university data
      const university: University = {
        id: index + 1,
        name: uniName,
        country: getCountryFromUniversity(uniName),
        ranking: getUniversityRanking(uniName),
        matchScore: roundedScore,
        matchReason: generateMatchReason(uniName, roundedScore, preferences),
        creditTransfer: Math.floor(Math.random() * 30) + 70,
        gpaRequirement: Math.round((Math.random() * 0.5 + 3.3) * 10) / 10,
        languageRequirement: preferences.languageTest === 'IELTS' ? 
          `${Math.round((Math.random() * 1 + 6) * 10) / 10} (${preferences.languageTest})` : 
          `${Math.floor(Math.random() * 10) + 90} (${preferences.languageTest})`,
        programs: generateRelevantPrograms(preferences.major),
        image: getUniversityImage(uniName)
      };
      
      results.push({
        university,
        score: roundedScore,
        explanation: university.matchReason
      });
    });
    
    // Sort results by match score (descending)
    results.sort((a, b) => b.score - a.score);
    
    setMatchResults(results);
    setIsMatched(true);
    setActiveTab('results');
  };
  
  // Helper function to get country from university name
  const getCountryFromUniversity = (uniName: string): string => {
    if (uniName.includes('MIT') || uniName.includes('Stanford')) return 'United States';
    if (uniName.includes('Oxford') || uniName.includes('Cambridge') || uniName.includes('Imperial') || uniName.includes('London')) return 'United Kingdom';
    if (uniName.includes('ETH') || uniName.includes('Zurich')) return 'Switzerland';
    if (uniName.includes('Tokyo')) return 'Japan';
    if (uniName.includes('Singapore')) return 'Singapore';
    if (uniName.includes('Toronto') || uniName.includes('British Columbia')) return 'Canada';
    if (uniName.includes('Tsinghua') || uniName.includes('Peking')) return 'China';
    if (uniName.includes('Melbourne') || uniName.includes('Sydney')) return 'Australia';
    if (uniName.includes('Munich')) return 'Germany';
    if (uniName.includes('Seoul')) return 'South Korea';
    if (uniName.includes('Hong Kong')) return 'Hong Kong SAR';
    if (uniName.includes('Sorbonne')) return 'France';
    if (uniName.includes('Nanyang')) return 'Singapore';
    return 'Other';
  };
  
  // Helper function to get university ranking
  const getUniversityRanking = (uniName: string): number => {
    const rankings: Record<string, number> = {
      'Massachusetts Institute of Technology (MIT)': 1,
      'Stanford University': 2,
      'University of Oxford': 3,
      'University of Cambridge': 4,
      'ETH Zurich': 5,
      'Imperial College London': 6,
      'University of Tokyo': 7,
      'National University of Singapore': 8,
      'University of Toronto': 9,
      'Tsinghua University': 10,
      'Peking University': 11,
      'University of Melbourne': 12,
      'Technical University of Munich': 13,
      'Seoul National University': 14,
      'University of Hong Kong': 15,
      'Sorbonne University': 16,
      'University of Sydney': 17,
      'Nanyang Technological University': 18,
      'University of British Columbia': 19,
      'London School of Economics': 20
    };
    
    return rankings[uniName] || Math.floor(Math.random() * 30) + 20;
  };
  
  // Helper function to generate match reason
  const generateMatchReason = (uniName: string, score: number, prefs: typeof preferences): string => {
    if (score >= 9) {
      return `Excellent match for your ${prefs.major} major! Your academic profile aligns perfectly with ${uniName}'s requirements. Your interests in ${prefs.interests.slice(0, 2).join(' and ')} match with the university's strong research areas. Credit transfer potential is high.`;
    } else if (score >= 7.5) {
      return `Strong match for your profile. ${uniName} offers excellent programs in ${prefs.major}. Your GPA of ${prefs.gpa} meets their requirements, and your language proficiency is sufficient. Consider strengthening your application with relevant extracurricular activities.`;
    } else if (score >= 6) {
      return `Good potential match, but there are some areas to improve. ${uniName}'s ${prefs.major} program may have higher GPA requirements than your current ${prefs.gpa}. Your language score is acceptable, but higher scores would strengthen your application.`;
    } else {
      return `This university may be challenging to get into with your current profile. ${uniName} typically requires higher academic credentials for ${prefs.major}. Consider improving your GPA and language scores or applying to their less competitive programs.`;
    }
  };
  
  // Helper function to generate relevant programs
  const generateRelevantPrograms = (major: string): string[] => {
    const baseProgramMap: Record<string, string[]> = {
      'Computer Science': ['Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Data Science'],
      'Electrical Engineering': ['Electrical Engineering', 'Electronics', 'Computer Engineering', 'Telecommunications'],
      'Mechanical Engineering': ['Mechanical Engineering', 'Robotics', 'Aerospace Engineering', 'Automotive Engineering'],
      'Business Administration': ['Business Administration', 'Management', 'Marketing', 'Entrepreneurship'],
      'Economics': ['Economics', 'Econometrics', 'Financial Economics', 'International Economics'],
      'Mathematics': ['Mathematics', 'Applied Mathematics', 'Statistics', 'Mathematical Finance']
    };
    
    const defaultPrograms = [major, 'General Studies', 'International Studies', 'Exchange Program'];
    return baseProgramMap[major] || defaultPrograms;
  };
  
  // Helper function to get university image
  const getUniversityImage = (uniName: string): string => {
    // In a real application, you would have actual image URLs for each university
    // Here we're using placeholder images
    const imageMap: Record<string, string> = {
      'Massachusetts Institute of Technology (MIT)': 'https://images.unsplash.com/photo-1569585723035-0e9e6f819a84',
      'Stanford University': 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
      'University of Oxford': 'https://images.unsplash.com/photo-1526338259590-8b93e54f6d91',
      'ETH Zurich': 'https://images.unsplash.com/photo-1564957341664-6f5f59f5d3c4',
      'Imperial College London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      'University of Tokyo': 'https://images.unsplash.com/photo-1565451577557-5c7a5a8367a0'
    };
    
    return imageMap[uniName] || `https://source.unsplash.com/800x600/?university,${uniName.split(' ')[0].toLowerCase()}`;
  };

  return (
    <div className="matchmaking-page">
      <h1 className="page-title">University Matchmaking</h1>
      
      <div className="matchmaking-tabs">
        <button 
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Your Preferences
        </button>
        <button 
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={!isMatched}
        >
          Match Results
        </button>
      </div>
      
      <div className="matchmaking-content">
        {activeTab === 'preferences' ? (
          <div className="preferences-section">
            <div className="section-intro">
              <h2>Set Your University Preferences</h2>
              <p>
                Rank up to 10 universities you're interested in, and our algorithm will analyze 
                your profile and preferences to provide personalized match scores and recommendations.
              </p>
            </div>
            
            <div className="university-preferences">
              <h3>University Ranking</h3>
              <p className="section-description">
                List your preferred universities in order of preference (most preferred first):
              </p>
              
              <div className="university-ranking-list">
                {preferences.universities.map((uni, index) => (
                  <div key={index} className="university-rank-item">
                    <div className="rank-number">{index + 1}</div>
                    <select
                      value={uni}
                      onChange={(e) => handleUniversityChange(index, e.target.value)}
                      className="university-select"
                    >
                      <option value="">-- Select University --</option>
                      {availableUniversities.map((university) => (
                        <option key={university} value={university}>
                          {university}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="academic-profile">
              <h3>Academic Profile</h3>
              <p className="section-description">
                Enter your academic information to improve match accuracy:
              </p>
              
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="major">Major/Field of Study</label>
                  <select
                    id="major"
                    name="major"
                    value={preferences.major}
                    onChange={handlePreferenceChange}
                    className="form-control"
                  >
                    {availableMajors.map((major) => (
                      <option key={major} value={major}>
                        {major}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="gpa">GPA (4.0 scale)</label>
                  <input
                    type="number"
                    id="gpa"
                    name="gpa"
                    min="0"
                    max="4.0"
                    step="0.1"
                    value={preferences.gpa}
                    onChange={handlePreferenceChange}
                    className="form-control"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="languageTest">Language Test</label>
                    <select
                      id="languageTest"
                      name="languageTest"
                      value={preferences.languageTest}
                      onChange={handlePreferenceChange}
                      className="form-control"
                    >
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="Cambridge">Cambridge</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="languageScore">Score</label>
                    <input
                      type="number"
                      id="languageScore"
                      name="languageScore"
                      min="0"
                      step="0.1"
                      value={preferences.languageScore}
                      onChange={handlePreferenceChange}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="interests">Academic Interests (comma-separated)</label>
                  <input
                    type="text"
                    id="interests"
                    name="interests"
                    value={preferences.interests.join(', ')}
                    onChange={handleInterestsChange}
                    className="form-control"
                    placeholder="e.g., Artificial Intelligence, Data Science, Machine Learning"
                  />
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary btn-generate" 
                onClick={generateMatchResults}
                disabled={isLoading || preferences.universities.filter(u => u !== '').length === 0}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing your profile...
                  </>
                ) : (
                  'Generate Match Results'
                )}
              </button>
            </div>
            
            {/* Powered-by section removed */}
          </div>
        ) : (
          <div className="results-section">
            {isMatched ? (
              <>
                <div className="results-header">
                  <h2>Your University Match Results</h2>
                  <p className="results-description">
                    Based on your academic profile and preferences, here are your personalized university matches:
                  </p>
                </div>
                
                <div className="match-results-list">
                  {matchResults.map((result, index) => (
                    <div key={index} className="match-result-card">
                      <div className="match-result-header">
                        <div className="university-image">
                          <img src={result.university.image} alt={result.university.name} />
                        </div>
                        <div className="match-score-container">
                          <div className={`match-score ${result.score >= 8 ? 'excellent' : result.score >= 6.5 ? 'good' : 'moderate'}`}>
                            {result.score}
                          </div>
                          <div className="match-label">Match Score</div>
                        </div>
                      </div>
                      
                      <div className="match-result-content">
                        <h3 className="university-name">{result.university.name}</h3>
                        <div className="university-meta">
                          <span className="university-country">{result.university.country}</span>
                          <span className="university-ranking">World Rank: #{result.university.ranking}</span>
                        </div>
                        
                        <div className="match-explanation">
                          <h4>Match Analysis</h4>
                          <p>{result.university.matchReason}</p>
                        </div>
                        
                        <div className="university-details">
                          <div className="detail-row">
                            <div className="detail-label">Credit Transfer</div>
                            <div className="detail-value">{result.university.creditTransfer}%</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">GPA Requirement</div>
                            <div className="detail-value">{result.university.gpaRequirement}</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">Language Requirement</div>
                            <div className="detail-value">{result.university.languageRequirement}</div>
                          </div>
                        </div>
                        
                        <div className="available-programs">
                          <h4>Available Programs</h4>
                          <div className="programs-list">
                            {result.university.programs.map((program, i) => (
                              <span key={i} className="program-tag">{program}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="match-result-footer">
                        <button className="btn-secondary">View University Details</button>
                        <button className="btn-primary">Add to Application</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="results-footer">
                  <button className="btn-secondary" onClick={() => setActiveTab('preferences')}>
                    Adjust Preferences
                  </button>
                </div>
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No Match Results Yet</h3>
                <p>Please fill in your preferences and generate match results first.</p>
                <button className="btn-primary" onClick={() => setActiveTab('preferences')}>
                  Set Preferences
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matchmaking;
