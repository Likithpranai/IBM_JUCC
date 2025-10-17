const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');
const router = express.Router();

// Load university requirements data
let universityData = [];
const loadUniversityData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../university_requirements.csv'))
      .pipe(csv())
      .on('data', (data) => universityData.push(data))
      .on('end', () => {
        console.log(`Loaded ${universityData.length} university requirements`);
        resolve(universityData);
      })
      .on('error', (error) => {
        console.error('Error loading university data:', error);
        reject(error);
      });
  });
};

// Initialize data
loadUniversityData().catch(err => console.error('Failed to load university data:', err));

// IBM WatsonX API configuration
const WATSONX_API_KEY = process.env.WATSONX_API_KEY || 'your-api-key'; // Replace with actual key in production
const WATSONX_API_URL = process.env.WATSONX_API_URL || 'https://us-south.ml.cloud.ibm.com/ml/v1/generation/text';
const WATSONX_MODEL = 'granite-13b-instruct-v2';

// Function to generate local response based on university data and query
function generateLocalResponse(query, studentProfile, universityContext) {
  const lowerQuery = query.toLowerCase();
  
  // Check for university-specific questions
  if (universityContext) {
    // Extract university name if present in the context
    const uniMatch = universityContext.match(/University: ([^\n]+)/);
    const uniName = uniMatch ? uniMatch[1] : null;
    
    // Extract GPA requirement if present in the context
    const gpaMatch = universityContext.match(/GPA Requirement: ([0-9.]+)/);
    const gpaReq = gpaMatch ? parseFloat(gpaMatch[1]) : null;
    
    // Extract IELTS requirement if present in the context
    const ieltsMatch = universityContext.match(/IELTS Requirement: ([0-9.]+)/);
    const ieltsReq = ieltsMatch ? parseFloat(ieltsMatch[1]) : null;
    
    // Student's GPA and IELTS
    const studentGPA = studentProfile && studentProfile.GPA ? parseFloat(studentProfile.GPA) : null;
    const studentIELTS = studentProfile && studentProfile.IELTS ? parseFloat(studentProfile.IELTS) : null;
    
    // Check if query is about requirements
    if (lowerQuery.includes('requirement') || lowerQuery.includes('gpa') || lowerQuery.includes('ielts')) {
      let response = ``;
      
      if (uniName) {
        response += `${uniName} requires a minimum GPA of ${gpaReq} and an IELTS score of ${ieltsReq}. `;
        
        // Compare with student profile if available
        if (studentGPA !== null && gpaReq !== null) {
          if (studentGPA >= gpaReq) {
            response += `Your GPA of ${studentGPA} meets or exceeds their requirement. `;
          } else {
            const gap = (gpaReq - studentGPA).toFixed(1);
            response += `Your GPA of ${studentGPA} is ${gap} points below their requirement. You may want to consider strengthening other parts of your application or looking at universities with lower GPA requirements. `;
          }
        }
        
        if (studentIELTS !== null && ieltsReq !== null) {
          if (studentIELTS >= ieltsReq) {
            response += `Your IELTS score of ${studentIELTS} meets or exceeds their requirement.`;
          } else {
            const gap = (ieltsReq - studentIELTS).toFixed(1);
            response += `Your IELTS score of ${studentIELTS} is ${gap} points below their requirement. Consider retaking the test or looking at universities with lower language requirements.`;
          }
        }
      } else {
        response = `Most top universities require a GPA of 3.5+ and IELTS scores of 6.5+. More competitive programs like those at MIT, Stanford, and Oxford typically require GPAs of 3.8+ and IELTS scores of 7.0+.`;
      }
      
      return response;
    }
    
    // Check if query is about credit transfer
    if (lowerQuery.includes('credit') || lowerQuery.includes('transfer')) {
      if (uniName) {
        let response = `Credit transfer policies at ${uniName} vary by department. `;
        
        // Extract credit transfer info if present in the context
        if (universityContext.includes('Engineering Credit Transfer:')) {
          response += `For Engineering, the following courses are transferable: ${universityContext.match(/Engineering Credit Transfer: ([^\n]+)/)[1]}. `;
        }
        
        if (universityContext.includes('Science Credit Transfer:')) {
          response += `For Science, the following courses are transferable: ${universityContext.match(/Science Credit Transfer: ([^\n]+)/)[1]}. `;
        }
        
        if (universityContext.includes('Business Credit Transfer:')) {
          response += `For Business, the following courses are transferable: ${universityContext.match(/Business Credit Transfer: ([^\n]+)/)[1]}.`;
        }
        
        return response;
      } else {
        return `Credit transfer policies vary by university and department. It's important to check specific course equivalencies before applying. Most universities require detailed course descriptions and syllabi for evaluation.`;
      }
    }
  }
  
  // General questions
  if (lowerQuery.includes('deadline')) {
    return `The application deadline for the Fall 2026 exchange program is January 15, 2026. For Spring 2027, the deadline is August 30, 2026. I recommend applying at least 2 weeks before the deadline to ensure all your documents are processed in time.`;
  }
  
  if (lowerQuery.includes('improve') && lowerQuery.includes('application')) {
    return `To improve your application: 1) Maintain a strong GPA, 2) Get involved in extracurricular activities relevant to your field, 3) Obtain strong recommendation letters, 4) Write a compelling personal statement, and 5) Demonstrate language proficiency. Would you like more specific advice on any of these areas?`;
  }
  
  if (lowerQuery.includes('how many') && lowerQuery.includes('universit')) {
    return `You can apply to up to 5 universities through our exchange program. I recommend selecting a mix of ambitious choices and safer options based on your academic profile and preferences.`;
  }
  
  // Default response
  return `I understand you're asking about ${query.substring(0, 30)}... To provide you with the most accurate information, I recommend checking the university's official website or contacting our exchange office for specific details.`;
}

// Function to call IBM WatsonX API
async function callWatsonX(prompt) {
  try {
    // For development/testing, uncomment this line to use local fallback instead of API call
    // throw new Error('Using local fallback for testing');
    
    const response = await axios.post(
      WATSONX_API_URL,
      {
        model_id: WATSONX_MODEL,
        input: prompt,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 500,
          min_new_tokens: 50,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WATSONX_API_KEY}`
        }
      }
    );
    
    return response.data.results[0].generated_text;
  } catch (error) {
    console.error('Error calling WatsonX API:', error.response?.data || error.message);
    throw new Error('Failed to get response from WatsonX');
  }
}

// Function to generate context from university data
function generateUniversityContext(query) {
  const lowerQuery = query.toLowerCase();
  let context = '';
  
  // Extract university name from query if present
  const universityNames = universityData.map(uni => uni['University Name'].toLowerCase());
  const mentionedUniversity = universityNames.find(name => lowerQuery.includes(name.toLowerCase()));
  
  if (mentionedUniversity) {
    const uniData = universityData.find(uni => 
      uni['University Name'].toLowerCase() === mentionedUniversity
    );
    
    if (uniData) {
      context += `University: ${uniData['University Name']}\n`;
      context += `GPA Requirement: ${uniData['Min GPA']}\n`;
      context += `IELTS Requirement: ${uniData['Min IELTS']}\n`;
      context += `Required Extracurriculars: ${uniData['Required Extracurriculars']}\n`;
      
      // Check for credit transfer info if query mentions it
      if (lowerQuery.includes('credit') || lowerQuery.includes('transfer')) {
        if (lowerQuery.includes('engineering') || lowerQuery.includes('engineer')) {
          context += `Engineering Credit Transfer: ${uniData['Engineering Credit Transfer']}\n`;
        }
        if (lowerQuery.includes('science')) {
          context += `Science Credit Transfer: ${uniData['Science Credit Transfer']}\n`;
        }
        if (lowerQuery.includes('business')) {
          context += `Business Credit Transfer: ${uniData['Business Credit Transfer']}\n`;
        }
      }
      
      context += `Additional Requirements: ${uniData['Additional Requirements']}\n`;
    }
  } else if (lowerQuery.includes('gpa') || lowerQuery.includes('ielts') || lowerQuery.includes('requirement')) {
    // Provide general information about requirements
    context += "Here's a summary of requirements for top universities:\n";
    universityData.slice(0, 5).forEach(uni => {
      context += `${uni['University Name']}: GPA ${uni['Min GPA']}, IELTS ${uni['Min IELTS']}\n`;
    });
  } else if (lowerQuery.includes('credit') || lowerQuery.includes('transfer')) {
    // Provide general information about credit transfer
    context += "Credit transfer policies vary by university and department. Some courses may not be transferable. ";
    context += "It's important to check specific course equivalencies before applying.\n";
  }
  
  return context;
}

// Chatbot API endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, studentProfile } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Generate context based on university data
    const universityContext = generateUniversityContext(message);
    
    // Create prompt for WatsonX
    let prompt = `You are an AI assistant for a university exchange program. Answer the following question based on the provided context.
    
Student question: ${message}

${studentProfile ? `Student profile:
GPA: ${studentProfile.GPA || 'Not provided'}
IELTS: ${studentProfile.IELTS || 'Not provided'}
Major: ${studentProfile.Major || 'Not provided'}
Year: ${studentProfile.Year || 'Not provided'}
` : ''}

${universityContext ? `Relevant university information:
${universityContext}
` : ''}

Provide a helpful, accurate response. If the student is asking about a university with requirements significantly above their profile, suggest alternatives or ways to strengthen their application. If specific credit transfer information is requested, be precise about which courses transfer and which don't.

Your response:`;

    try {
      // Try to call WatsonX API
      const watsonResponse = await callWatsonX(prompt);
      
      // Determine if the response should be flagged for human review
      const shouldFlag = determineIfShouldFlag(message, watsonResponse);
      
      res.json({
        response: watsonResponse,
        flagged: shouldFlag
      });
    } catch (error) {
      console.log('Using local fallback response due to WatsonX API error');
      
      // Generate local fallback response
      const localResponse = generateLocalResponse(message, studentProfile, universityContext);
      
      // Local responses are less likely to need flagging, but we'll check anyway
      const shouldFlag = determineIfShouldFlag(message, localResponse);
      
      res.json({
        response: localResponse,
        flagged: shouldFlag,
        isLocalFallback: true
      });
    }
  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({ 
      error: 'Failed to process your request',
      fallbackResponse: "I'm having trouble processing your request. Please try again or contact the exchange office for assistance."
    });
  }
});

// Function to determine if a response should be flagged for human review
function determineIfShouldFlag(query, response) {
  const complexTopics = [
    'visa', 'immigration', 'work permit', 'scholarship', 'financial aid',
    'specific course', 'accommodation', 'housing', 'deadline extension',
    'special consideration', 'disability', 'medical condition'
  ];
  
  const lowerQuery = query.toLowerCase();
  
  // Flag if query contains complex topics
  if (complexTopics.some(topic => lowerQuery.includes(topic))) {
    return true;
  }
  
  // Flag if response contains uncertainty markers
  const uncertaintyMarkers = [
    "I'm not sure", "I don't know", "I'm uncertain", 
    "I'd need to check", "contact the exchange office",
    "cannot provide specific"
  ];
  
  if (uncertaintyMarkers.some(marker => response.includes(marker))) {
    return true;
  }
  
  return false;
}

module.exports = router;
