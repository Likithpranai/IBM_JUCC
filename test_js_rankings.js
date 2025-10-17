const fs = require('fs');
const path = require('path');

// Test data
const student = {
  'First Name': 'Test',
  'Last Name': 'User',
  'GPA': '3.8',
  'IELTS': '8.0',
  'Top 10': 'Berkeley, MIT, Stanford'
};

// Direct implementation of university rankings in JavaScript
function generateDirectRankings(student) {
  console.log('Generating direct rankings in JavaScript');
  
  // Load university requirements data
  const universityData = [];
  
  try {
    // Synchronously read the CSV file
    const csvData = fs.readFileSync(path.join(__dirname, 'university_requirements.csv'), 'utf8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    // Parse the CSV data manually
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const uni = {};
      
      for (let j = 0; j < headers.length; j++) {
        uni[headers[j]] = values[j];
      }
      
      universityData.push(uni);
    }
    
    console.log(`Loaded ${universityData.length} universities from CSV`);
    console.log('First university:', universityData[0]);
  } catch (error) {
    console.error('Error loading university data:', error);
  }
  
  // Extract universities from student data
  let universities = [];
  if (student && student['Top 10']) {
    universities = student['Top 10'].split(', ').filter(uni => uni);
  }
  
  console.log('Input universities:', universities);
  
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
    console.log(`Processing university: ${uniName}`);
    
    // Find university requirements
    let uniReq = universityData.find(u => u['University Name'] === uniName);
    
    // If not found, try partial match
    if (!uniReq) {
      console.log(`No exact match for ${uniName}, trying partial match...`);
      uniReq = universityData.find(u => 
        uniName.includes(u['University Name']) || 
        u['University Name'].includes(uniName)
      );
      
      if (uniReq) {
        console.log(`Found partial match: ${uniName} -> ${uniReq['University Name']}`);
      } else {
        console.log(`No match found for ${uniName}`);
      }
    } else {
      console.log(`Found exact match for ${uniName}`);
    }
    
    // Use defaults if still not found
    const minGPA = uniReq ? parseFloat(uniReq['Min GPA']) : 3.5;
    const minIELTS = uniReq ? parseFloat(uniReq['Min IELTS']) : 7.0;
    const requiredExtracurriculars = uniReq ? parseInt(uniReq['Required Extracurriculars']) : 3;
    
    // Calculate score factors
    const baseScore = 8.5;  // Start with a high base score
    const gpaFactor = studentGPA >= minGPA ? 1.0 : 0.8;
    const ieltsFactor = studentIELTS >= minIELTS ? 1.0 : 0.8;
    
    // Ranking bonus - higher preference universities get a bonus
    const rankingBonus = Math.max(0, 0.5 - (i * 0.05));
    
    // Calculate final score
    let finalScore = baseScore * gpaFactor * ieltsFactor + rankingBonus;
    
    // Ensure top universities get high scores
    if (i < 3) {
      finalScore = Math.max(finalScore, 8.5);
    }
    
    // Cap at 10
    finalScore = Math.min(10, finalScore);
    const roundedScore = Math.round(finalScore * 10) / 10;
    
    // Generate explanation
    let explanation;
    const gpaText = studentGPA >= minGPA ? 
      `Your GPA of ${studentGPA} meets or exceeds the minimum requirement of ${minGPA}.` : 
      `Your GPA of ${studentGPA} is below the minimum requirement of ${minGPA}.`;
      
    const ieltsText = studentIELTS >= minIELTS ? 
      `Your IELTS score of ${studentIELTS} meets or exceeds the minimum requirement of ${minIELTS}.` : 
      `Your IELTS score of ${studentIELTS} is below the minimum requirement of ${minIELTS}.`;
    
    // Add ranking position context
    const rankText = `This university was your #${i+1} choice. `;
    
    if (roundedScore >= 9.0) {
      explanation = `${rankText}Excellent match! ${gpaText} ${ieltsText}`;
    } else if (roundedScore >= 8.0) {
      explanation = `${rankText}Very good match. ${gpaText} ${ieltsText}`;
    } else {
      explanation = `${rankText}Good match. ${gpaText} ${ieltsText}`;
    }
    
    // Add university requirements if available
    if (uniReq && uniReq['Additional Requirements']) {
      explanation += ` Note: ${uniReq['Additional Requirements']}`;
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

// Generate rankings
const rankings = generateDirectRankings(student);

// Print results
console.log(JSON.stringify(rankings, null, 2));
