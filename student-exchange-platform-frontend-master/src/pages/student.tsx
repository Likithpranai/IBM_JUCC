import React, { useState, useEffect } from 'react';
import '../styles/student.css';

interface University {
  id: number;
  name: string;
  country: string;
  ranking: number;
  programs: string[];
  requirements: {
    gpa: number;
    language: string;
    languageScore: number;
  };
  applicationDeadline: string;
  exchangeSpots: number;
  photo: string;
  description: string;
}

const mockUniversities: University[] = [
  {
    id: 1,
    name: "University of Tokyo",
    country: "Japan",
    ranking: 23,
    programs: ["Computer Science", "Engineering", "Business", "Arts & Humanities"],
    requirements: {
      gpa: 3.5,
      language: "IELTS",
      languageScore: 6.5
    },
    applicationDeadline: "2026-01-15",
    exchangeSpots: 5,
    photo: "https://images.unsplash.com/photo-1565451577557-5c7a5a8367a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "The University of Tokyo, established in 1877, is Japan's most prestigious university and one of Asia's top educational institutions. Known for its rigorous academic programs and cutting-edge research, it offers a vibrant exchange experience in the heart of Tokyo."
  },
  {
    id: 2,
    name: "London School of Economics",
    country: "United Kingdom",
    ranking: 27,
    programs: ["Economics", "Political Science", "Sociology", "Law"],
    requirements: {
      gpa: 3.7,
      language: "IELTS",
      languageScore: 7.0
    },
    applicationDeadline: "2026-02-01",
    exchangeSpots: 3,
    photo: "https://images.unsplash.com/photo-1534191100224-8d0fc7a3f22a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "The London School of Economics and Political Science (LSE) is a world-leading social science institution. Located in the heart of London, LSE offers exchange students access to renowned faculty, diverse perspectives, and unparalleled networking opportunities in one of the world's most dynamic cities."
  },
  {
    id: 3,
    name: "ETH Zurich",
    country: "Switzerland",
    ranking: 9,
    programs: ["Engineering", "Architecture", "Computer Science", "Natural Sciences"],
    requirements: {
      gpa: 3.6,
      language: "IELTS",
      languageScore: 6.5
    },
    applicationDeadline: "2026-01-30",
    exchangeSpots: 4,
    photo: "https://images.unsplash.com/photo-1564957341664-6f5f59f5d3c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "ETH Zurich (Swiss Federal Institute of Technology) is consistently ranked among the top universities in the world for science and technology. Founded in 1855, it offers exchange students access to cutting-edge research facilities, innovative teaching methods, and the beautiful surroundings of Zurich."
  },
  {
    id: 4,
    name: "MIT",
    country: "United States",
    ranking: 1,
    programs: ["Engineering", "Computer Science", "Physics", "Business"],
    requirements: {
      gpa: 3.8,
      language: "TOEFL",
      languageScore: 100
    },
    applicationDeadline: "2025-12-15",
    exchangeSpots: 2,
    photo: "https://images.unsplash.com/photo-1569585723035-0e9e6f819a84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "The Massachusetts Institute of Technology (MIT) is a world-renowned institution dedicated to advancing knowledge and educating students in science, technology, and other areas of scholarship. Exchange students at MIT experience a rigorous academic environment and innovative research opportunities in Cambridge, Massachusetts."
  },
  {
    id: 5,
    name: "Stanford University",
    country: "United States",
    ranking: 3,
    programs: ["Computer Science", "Business", "Engineering", "Humanities"],
    requirements: {
      gpa: 3.8,
      language: "TOEFL",
      languageScore: 100
    },
    applicationDeadline: "2025-12-01",
    exchangeSpots: 3,
    photo: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Stanford University, located in the heart of Silicon Valley, is one of the world's leading teaching and research institutions. Exchange students benefit from Stanford's entrepreneurial spirit, interdisciplinary approach, and connections to the tech industry, all while enjoying California's beautiful weather."
  },
  {
    id: 6,
    name: "Imperial College London",
    country: "United Kingdom",
    ranking: 8,
    programs: ["Engineering", "Medicine", "Natural Sciences", "Business"],
    requirements: {
      gpa: 3.7,
      language: "IELTS",
      languageScore: 7.0
    },
    applicationDeadline: "2026-01-15",
    exchangeSpots: 4,
    photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Imperial College London is a world-class university with a focus on science, engineering, medicine, and business. Located in South Kensington, exchange students enjoy access to cutting-edge research facilities while experiencing life in one of the world's most vibrant and diverse cities."
  },
  {
    id: 7,
    name: "Sorbonne University",
    country: "France",
    ranking: 35,
    programs: ["Arts & Humanities", "Languages", "Social Sciences", "Sciences"],
    requirements: {
      gpa: 3.5,
      language: "DELF",
      languageScore: 7.0
    },
    applicationDeadline: "2026-02-15",
    exchangeSpots: 6,
    photo: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Sorbonne University is a historic and prestigious institution in the heart of Paris. With roots dating back to the 13th century, it offers exchange students a blend of rich academic tradition and modern research facilities, all while experiencing the cultural wealth of the French capital."
  },
  {
    id: 8,
    name: "Technical University of Munich",
    country: "Germany",
    ranking: 41,
    programs: ["Engineering", "Computer Science", "Natural Sciences", "Medicine"],
    requirements: {
      gpa: 3.5,
      language: "TestDaF",
      languageScore: 4.0
    },
    applicationDeadline: "2026-01-15",
    exchangeSpots: 5,
    photo: "https://images.unsplash.com/photo-1597005181977-9aa9b05f0939?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "The Technical University of Munich (TUM) is one of Europe's top universities for engineering and natural sciences. Known for its strong connections to industry and research excellence, TUM offers exchange students a high-quality education in Bavaria's beautiful capital city."
  }
];

const StudentPanel: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>(mockUniversities);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<Record<number, string>>({});

  // Get unique countries for filter dropdown
  const countries = ['All Countries', ...Array.from(new Set(mockUniversities.map(uni => uni.country)))].sort();

  // Filter universities based on search term and country
  useEffect(() => {
    let filtered = [...mockUniversities];
    
    if (searchTerm) {
      filtered = filtered.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.programs.some(program => program.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterCountry && filterCountry !== 'All Countries') {
      filtered = filtered.filter(uni => uni.country === filterCountry);
    }
    
    setUniversities(filtered);
  }, [searchTerm, filterCountry]);

  // Handle university selection
  const handleUniversitySelect = (university: University) => {
    if (selectedUniversity?.id === university.id) {
      setSelectedUniversity(null);
    } else {
      setSelectedUniversity(university);
    }
  };

  // Handle application submission
  const handleApply = (universityId: number) => {
    setApplicationStatus(prev => ({
      ...prev,
      [universityId]: 'applied'
    }));
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadlineString: string) => {
    const today = new Date();
    const deadline = new Date(deadlineString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="content-container">
      <div className="student-header">
        <div className="student-title-section">
          <h1 className="page-title">Exchange University Explorer</h1>
          <p className="student-subtitle">Discover and apply to partner universities for your exchange semester</p>
          
          <div className="filters-row">
            <div className="filter-container">
              <label htmlFor="country-filter">Filter by Country:</label>
              <select
                id="country-filter"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="filter-select"
              >
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className="search-container">
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="student-content">
        <div className="universities-grid">
          {universities.map(university => (
            <div 
              key={university.id} 
              className={`university-card ${selectedUniversity?.id === university.id ? 'selected' : ''}`}
              onClick={() => handleUniversitySelect(university)}
            >
              <div className="university-card-header">
                <div className="university-image-container">
                  <img src={university.photo} alt={university.name} className="university-image" />
                  <div className="university-ranking">#{university.ranking}</div>
                </div>
                <div className="university-card-title">
                  <h3>{university.name}</h3>
                  <div className="university-location">
                    <span className="location-icon">📍</span>
                    <span>{university.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="university-card-details">
                <div className="detail-item">
                  <span className="detail-icon">🎓</span>
                  <span className="detail-label">Programs:</span>
                  <span className="detail-value">{university.programs.slice(0, 2).join(", ")}{university.programs.length > 2 ? "..." : ""}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span className="detail-label">GPA Req:</span>
                  <span className="detail-value">{university.requirements.gpa}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🗓️</span>
                  <span className="detail-label">Deadline:</span>
                  <span className="detail-value deadline">
                    {formatDate(university.applicationDeadline)}
                    <span className={`days-remaining ${getDaysRemaining(university.applicationDeadline) < 30 ? 'urgent' : ''}`}>
                      ({getDaysRemaining(university.applicationDeadline)} days left)
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="university-card-footer">
                <div className="spots-container">
                  <span className="spots-label">Exchange Spots:</span>
                  <span className="spots-value">{university.exchangeSpots}</span>
                </div>
                <button 
                  className={`btn-apply ${applicationStatus[university.id] ? 'applied' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(university.id);
                  }}
                  disabled={applicationStatus[university.id] === 'applied'}
                >
                  {applicationStatus[university.id] === 'applied' ? 'Applied ✓' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {selectedUniversity && (
          <div className="university-details">
            <div className="university-details-header">
              <img src={selectedUniversity.photo} alt={selectedUniversity.name} className="university-details-image" />
              <div className="university-details-overlay">
                <h2>{selectedUniversity.name}</h2>
                <div className="university-details-location">
                  <span className="location-icon">📍</span>
                  <span>{selectedUniversity.country}</span>
                </div>
                <div className="university-details-ranking">
                  World Ranking: #{selectedUniversity.ranking}
                </div>
              </div>
            </div>
            
            <div className="university-details-content">
              <div className="university-description">
                <h3>About the University</h3>
                <p>{selectedUniversity.description}</p>
              </div>
              
              <div className="university-details-section">
                <h3>Available Programs</h3>
                <div className="programs-list">
                  {selectedUniversity.programs.map((program, index) => (
                    <div key={index} className="program-item">
                      <span className="program-icon">📚</span>
                      <span>{program}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="university-details-section">
                <h3>Requirements</h3>
                <div className="requirements-list">
                  <div className="requirement-item">
                    <span className="requirement-icon">📊</span>
                    <span className="requirement-label">Minimum GPA:</span>
                    <span className="requirement-value">{selectedUniversity.requirements.gpa}</span>
                  </div>
                  <div className="requirement-item">
                    <span className="requirement-icon">🗣️</span>
                    <span className="requirement-label">Language Test:</span>
                    <span className="requirement-value">{selectedUniversity.requirements.language} {selectedUniversity.requirements.languageScore}</span>
                  </div>
                </div>
              </div>
              
              <div className="university-details-section">
                <h3>Application Information</h3>
                <div className="application-info">
                  <div className="application-item">
                    <span className="application-icon">🗓️</span>
                    <span className="application-label">Deadline:</span>
                    <span className="application-value">
                      {formatDate(selectedUniversity.applicationDeadline)}
                      <span className={`days-remaining ${getDaysRemaining(selectedUniversity.applicationDeadline) < 30 ? 'urgent' : ''}`}>
                        ({getDaysRemaining(selectedUniversity.applicationDeadline)} days remaining)
                      </span>
                    </span>
                  </div>
                  <div className="application-item">
                    <span className="application-icon">👥</span>
                    <span className="application-label">Available Spots:</span>
                    <span className="application-value">{selectedUniversity.exchangeSpots}</span>
                  </div>
                </div>
              </div>
              
              <div className="university-details-actions">
                <button 
                  className={`btn-apply-large ${applicationStatus[selectedUniversity.id] ? 'applied' : ''}`}
                  onClick={() => handleApply(selectedUniversity.id)}
                  disabled={applicationStatus[selectedUniversity.id] === 'applied'}
                >
                  {applicationStatus[selectedUniversity.id] === 'applied' ? 'Application Submitted ✓' : 'Submit Application'}
                </button>
                <button className="btn-download">
                  <span className="download-icon">📥</span>
                  <span>Download Info Pack</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPanel;
