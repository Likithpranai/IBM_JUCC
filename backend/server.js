const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const chatbotApi = require('./chatbot-api');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
function generateDirectRankings(student) {
  console.log('Generating direct rankings in JavaScript');
  const fs = require('fs');
  let universityData = [];
  
  try {
    const csvData = fs.readFileSync(path.join(__dirname, '..', 'university_requirements.csv'), 'utf8');
    const parseCSV = (text) => {
      const result = [];
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = {};
        let fieldStart = 0;
        let inQuotes = false;
        let currentField = 0;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            // End of field, extract value
            let value = lines[i].substring(fieldStart, j).trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }
            row[headers[currentField]] = value;
            fieldStart = j + 1;
            currentField++;
          }
        }
        
        // Handle the last field
        let value = lines[i].substring(fieldStart).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        row[headers[currentField]] = value;
        
        result.push(row);
      }
      
      return result;
    };
    
    universityData = parseCSV(csvData);
    
    console.log(`Loaded ${universityData.length} universities from CSV`);
  } catch (error) {
    console.error('Error loading university data:', error);
  }
  
  // Extract universities from student data
  let universities = [];
  if (student && student['Top 10']) {
    universities = student['Top 10'].split(', ').filter(uni => uni);
  }
  
  // If no universities provided, use some defaults
  if (universities.length === 0) {
    universities = [
      'Massachusetts Institute of Technology (MIT)',
      'Stanford University',
      'University of Oxford',
      'University of Cambridge',
      'Harvard University'
    ];
  }
  
  // Normalize university names
  const normalizedUniversities = universities.map(uni => {
    const uniLower = uni.toLowerCase();
    
    // Map common abbreviations and variations
    if (uniLower.includes('berkeley') || uniLower.includes('uc berkeley')) {
      return 'University of California, Berkeley';
    } else if (uniLower === 'mit' || uniLower.includes('massachusetts')) {
      return 'Massachusetts Institute of Technology (MIT)';
    } else if (uniLower.includes('stanford')) {
      return 'Stanford University';
    } else if (uniLower.includes('harvard')) {
      return 'Harvard University';
    } else if (uniLower.includes('oxford')) {
      return 'University of Oxford';
    } else if (uniLower.includes('cambridge')) {
      return 'University of Cambridge';
    } else {
      return uni;
    }
  });
  
  console.log('Normalized universities:', normalizedUniversities);
  
  // Extract student profile data
  const studentGPA = parseFloat(student.GPA || 3.5);
  const studentIELTS = parseFloat(student.IELTS || 7.0);
  
  // Generate rankings
  const rankings = [];
  
  for (let i = 0; i < normalizedUniversities.length; i++) {
    const uniName = normalizedUniversities[i];
    
    // Find university requirements
    let uniReq = universityData.find(u => u['University Name'] === uniName);
    
    // If not found, try partial match
    if (!uniReq) {
      uniReq = universityData.find(u => 
        uniName.includes(u['University Name']) || 
        u['University Name'].includes(uniName)
      );
    }
    
    // Use defaults if still not found
    const minGPA = uniReq ? parseFloat(uniReq['Min GPA']) : 3.5;
    const minIELTS = uniReq ? parseFloat(uniReq['Min IELTS']) : 7.0;
    const requiredExtracurriculars = uniReq ? parseInt(uniReq['Required Extracurriculars']) : 3;
    
    // Calculate score factors
    const baseScore = 7.0;  // Start with a moderate base score
    
    // More realistic GPA factor calculation
    let gpaFactor;
    if (studentGPA >= minGPA) {
      gpaFactor = 1.0; // Meets requirements
    } else if (studentGPA >= (minGPA - 0.2)) {
      gpaFactor = 0.8; // Slightly below
    } else if (studentGPA >= (minGPA - 0.5)) {
      gpaFactor = 0.6; // Moderately below
    } else {
      gpaFactor = 0.3; // Significantly below
    }
    
    // For elite universities (MIT, Stanford, Harvard), be more strict
    if ((uniName.includes('MIT') || 
         uniName.includes('Harvard') || 
         uniName.includes('Stanford')) && 
        studentGPA < minGPA) {
      gpaFactor *= 0.5; // Further penalty for elite schools
    }
    
    // More realistic IELTS factor
    let ieltsFactor;
    if (studentIELTS >= minIELTS) {
      ieltsFactor = 1.0;
    } else if (studentIELTS >= (minIELTS - 0.5)) {
      ieltsFactor = 0.7;
    } else {
      ieltsFactor = 0.4;
    }
    
    // Ranking bonus - higher preference universities get a bonus
    const rankingBonus = Math.max(0, 0.5 - (i * 0.05));
    
    // Calculate final score - weighted approach
    let finalScore = (baseScore * 0.3) + (gpaFactor * 4.0) + (ieltsFactor * 2.5) + rankingBonus;
    
    // Don't artificially boost scores for top choices if requirements aren't met
    // Only give preference bonus if the student meets at least 70% of requirements
    if (i < 3 && (gpaFactor >= 0.7 && ieltsFactor >= 0.7)) {
      finalScore += 0.5; // Small bonus for top choices only if mostly qualified
    }
    
    // For elite universities with strict requirements
    if ((uniName.includes('MIT') || uniName.includes('Harvard') || uniName.includes('Stanford'))) {
      // If GPA is significantly below minimum, cap the score
      if (studentGPA < (minGPA - 0.5)) {
        finalScore = Math.min(finalScore, 6.0); // Cap score for very low GPA
      }
    }
    
    // Cap at 10
    finalScore = Math.min(10, Math.max(3.0, finalScore)); // Minimum score of 3.0
    const roundedScore = Math.round(finalScore * 10) / 10;
    
    // Generate explanation
    let explanation;
    
    // Create detailed GPA analysis
    let gpaText;
    if (studentGPA >= minGPA + 0.3) {
      gpaText = `Your GPA of ${studentGPA} significantly exceeds their minimum requirement of ${minGPA}, giving you a strong academic advantage.`;
    } else if (studentGPA >= minGPA) {
      gpaText = `Your GPA of ${studentGPA} meets their minimum requirement of ${minGPA}, though strengthening other parts of your application would be beneficial.`;
    } else if (studentGPA >= minGPA - 0.3) {
      gpaText = `Your GPA of ${studentGPA} is slightly below their minimum requirement of ${minGPA}. This university places high value on extracurricular activities, which could compensate for this gap.`;
    } else {
      gpaText = `Your GPA of ${studentGPA} is below their minimum requirement of ${minGPA}. This university has historically been very selective about GPA requirements.`;
    }
    
    // Create detailed IELTS analysis
    let ieltsText;
    if (studentIELTS >= minIELTS + 0.5) {
      ieltsText = `Your IELTS score of ${studentIELTS} is well above their requirement of ${minIELTS}, which will strengthen your application.`;
    } else if (studentIELTS >= minIELTS) {
      ieltsText = `Your IELTS score of ${studentIELTS} meets their minimum requirement of ${minIELTS}.`;
    } else {
      ieltsText = `Your IELTS score of ${studentIELTS} is below their minimum requirement of ${minIELTS}. Consider retaking the test or providing additional language proficiency evidence.`;
    }
    
    // Add credit transfer analysis
    let creditText = '';
    if (uniReq) {
      const majorField = student.Major || 'your field';
      if (majorField.toLowerCase().includes('engineer') && uniReq['Engineering Credit Transfer']) {
        const transferCount = uniReq['Engineering Credit Transfer'].split(',').length;
        creditText = `\nCredit Transfer: This university accepts ${transferCount} engineering courses for transfer, which is ${transferCount > 5 ? 'excellent' : 'moderate'} for your program.`;
      } else if (majorField.toLowerCase().includes('science') && uniReq['Science Credit Transfer']) {
        const transferCount = uniReq['Science Credit Transfer'].split(',').length;
        creditText = `\nCredit Transfer: This university accepts ${transferCount} science courses for transfer, which is ${transferCount > 5 ? 'excellent' : 'moderate'} for your program.`;
      } else if ((majorField.toLowerCase().includes('business') || majorField.toLowerCase().includes('economics')) && uniReq['Business Credit Transfer']) {
        const transferCount = uniReq['Business Credit Transfer'].split(',').length;
        creditText = `\nCredit Transfer: This university accepts ${transferCount} business courses for transfer, which is ${transferCount > 5 ? 'excellent' : 'moderate'} for your program.`;
      }
    }
    
    // Add extracurricular context
    let ecaText = '';
    if (uniReq && uniReq['Required Extracurriculars']) {
      const ecaCount = parseInt(uniReq['Required Extracurriculars']);
      if (ecaCount >= 4) {
        ecaText = `\nThis university places significant emphasis on extracurricular activities (${ecaCount} recommended), so highlight your leadership roles and community involvement.`;
      } else if (ecaCount >= 2) {
        ecaText = `\nThis university values extracurricular involvement (${ecaCount} activities recommended) alongside academic performance.`;
      } else {
        ecaText = `\nThis university focuses primarily on academic metrics, with minimal emphasis on extracurricular activities.`;
      }
    }
    
    // Add ranking position context
    const rankText = `This university was your #${i+1} choice. `;
    
    // Combine all analyses
    if (roundedScore >= 9.0) {
      explanation = `${rankText}Excellent match! ${gpaText} ${ieltsText}${creditText}${ecaText}`;
    } else if (roundedScore >= 8.0) {
      explanation = `${rankText}Very good match. ${gpaText} ${ieltsText}${creditText}${ecaText}`;
    } else if (roundedScore >= 7.0) {
      explanation = `${rankText}Good match. ${gpaText} ${ieltsText}${creditText}${ecaText}`;
    } else if (roundedScore >= 5.0) {
      explanation = `${rankText}Moderate match. ${gpaText} ${ieltsText}${creditText}${ecaText} You may want to consider other options.`;
    } else {
      explanation = `${rankText}Low match. ${gpaText} ${ieltsText}${creditText}${ecaText} This university may be a reach for your current profile.`;
    }
    
    // Add university requirements if available
    if (uniReq && uniReq['Additional Requirements']) {
      explanation += `\nAdditional Requirements: ${uniReq['Additional Requirements']}`;
    }
    
    rankings.push({
      university: uniName,
      rank: roundedScore,
      explanation: explanation,
      details: {
        minGPA: minGPA,
        minIELTS: minIELTS,
        requiredExtracurriculars: requiredExtracurriculars
      }
    });
  }
  
  // Sort by rank
  rankings.sort((a, b) => b.rank - a.rank);
  return rankings;
}

// Route to handle matchmaking requests
app.post('/api/match', (req, res) => {
  const { student } = req.body;
  
  console.log(`Processing request for universities: ${student['Top 10']}`);
  
  // Use direct JavaScript implementation
  const rankings = generateDirectRankings(student);
  res.json({ rankings });
});

// Chatbot API routes
app.use('/api/chatbot', chatbotApi);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
