import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import '../styles/chatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  flagged?: boolean;
  loading?: boolean;
}

// Memoized message component for better performance
const ChatMessage = memo(({ message }: { message: Message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.flagged ? 'flagged-message' : ''}`}
    >
      {message.loading ? (
        <div className="loading-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <>
          <div className="message-content">{message.text}</div>
          <div className="message-timestamp">{formatTime(message.timestamp)}</div>
          {message.flagged && (
            <div className="flagged-indicator">
              <span className="flag-text">Advisor consultation recommended</span>
            </div>
          )}
        </>
      )}
    </div>
  );
});

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for the exchange program. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Suggested questions
  const suggestedQuestions = [
    "Based on my profile, which universities would I be eligible for?",
    "Which university provides the best credit transfer for my courses?",
    "I enjoy traveling during breaks. Which university location is best for me?",
    "Which universities value extracurricular activities more than GPA?",
    "Which exchange programs offer internship opportunities?"
  ];
  
  // Optimized scroll behavior with debounce
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    };
    
    // Scroll immediately for better UX
    scrollToBottom();
    
    // Also scroll after images might have loaded
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);
  
  // Student profile data (would normally come from user context/state)
  const studentProfile = {
    GPA: '3.5',
    IELTS: '7.0',
    Major: 'Computer Science',
    Year: '3rd',
    Interests: ['Technology', 'Travel', 'Photography'],
    ExtracurricularActivities: ['Student Council', 'Coding Club', 'Debate Team']
  };
  
  // Function to get predefined answers
  const getPredefinedAnswer = (question: string): { text: string; flagged: boolean } => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for eligibility questions
    if (lowerQuestion.includes('eligible') || 
        (lowerQuestion.includes('which') && lowerQuestion.includes('universit') && lowerQuestion.includes('profile'))) {
      return {
        text: `I've analyzed your profile with a GPA of ${studentProfile.GPA}, IELTS score of ${studentProfile.IELTS}, and ${studentProfile.Major} major. Here are the universities that would be great matches for you:\n\n` +
              `First, University of Toronto with a 90% match rate. Your GPA is actually above what they typically require, and they're known for having an excellent ${studentProfile.Major} program with renowned faculty and research opportunities.\n\n` +
              `Second, University of British Columbia with an 85% match. They particularly value students with your kind of extracurricular background in ${studentProfile.ExtracurricularActivities[0]} and ${studentProfile.ExtracurricularActivities[1]}. Their holistic admission approach would work in your favor.\n\n` +
              `Third, University of Melbourne with an 80% match. While your academic profile aligns well with their requirements, I should mention that their credit transfer system can be somewhat restrictive, so you might need to take some additional courses.\n\n` +
              `I would advise caution with universities like MIT and Stanford - they would be reach schools with your current GPA since they typically look for 3.8 or higher. If you're set on these schools, you might want to focus on strengthening other parts of your application.`,
        flagged: false
      };
    }
    
    // Check for credit transfer questions
    if (lowerQuestion.includes('credit transfer') || lowerQuestion.includes('transfer credit')) {
      return {
        text: `I've looked into credit transfer options specifically for your ${studentProfile.Major} courses, and here's what I found:\n\n` +
              `University of British Columbia has one of the best transfer systems for your major. They typically accept about 85% of core ${studentProfile.Major} courses, especially the foundational programming and theory classes. Their transfer evaluation process is also quite straightforward.\n\n` +
              `University of Toronto also stands out with their strong articulation agreements for ${studentProfile.Major} programs. They have an approximately 80% transfer rate, and they're particularly good with accepting advanced algorithm and systems courses if those are part of your curriculum.\n\n` +
              `University of Sydney is another good option - they accept most programming and theory courses, but I should mention they tend to be stricter when it comes to specialized or elective courses. They often require detailed syllabi for evaluation.\n\n` +
              `One important thing to keep in mind is that credit transfer policies can change from year to year, and each course typically needs individual evaluation. I'd recommend contacting the specific universities for the most up-to-date information once you narrow down your choices.`,
        flagged: false
      };
    }
    
    // Check for travel-related questions
    if (lowerQuestion.includes('travel') || lowerQuestion.includes('location')) {
      return {
        text: `Since you mentioned you enjoy traveling during breaks, I've got some great university recommendations based on location!\n\n` +
              `University of Barcelona would be my top suggestion. It's perfectly situated in a central European location with excellent transport links. You can find budget flights (often under $100) to most major European destinations. Many students take weekend trips to Paris, Rome, or Berlin. The academic calendar also gives you nice breaks to explore.\n\n` +
              `National University of Singapore is another fantastic option if you're interested in exploring Southeast Asia. Singapore serves as an incredible hub with affordable weekend trips to places like Thailand, Vietnam, and Indonesia. The university even has travel clubs that organize group trips during breaks.\n\n` +
              `University of Sydney offers a great base for exploring Australia. While flights to other regions might be longer and more expensive, you'll have access to amazing destinations within Australia itself. The East Coast has beautiful beaches, and internal flights to Melbourne or the Great Barrier Reef are reasonable.\n\n` +
              `One timing tip: if you choose a European university, the fall semester gives you the winter break to experience Christmas markets and winter festivals, while spring semester is ideal for Mediterranean beaches and outdoor activities. In Singapore and Sydney, the seasons are different, so plan accordingly!`,
        flagged: false
      };
    }
    
    // Check for extracurricular activities questions
    if (lowerQuestion.includes('extracurricular') || lowerQuestion.includes('activities')) {
      return {
        text: `You've asked about universities that value extracurricular activities more than just GPA, which is a great question! Some universities definitely take a more holistic approach to admissions.\n\n` +
              `University of Oxford stands out in this regard. They particularly value leadership roles like your experience in ${studentProfile.ExtracurricularActivities[0]}. Their admissions process includes interviews where they often ask about your extracurricular involvement and how it's shaped your perspective. Your debate team experience would be especially valuable there as they value students who can articulate their thoughts clearly.\n\n` +
              `University of Hong Kong is another excellent option. They place significant weight on community involvement and cultural activities. They're looking for students who will contribute to their diverse campus community, not just excel academically. They have a special section in their application specifically for highlighting these activities.\n\n` +
              `University of Melbourne has one of the most holistic admission approaches for exchange students I've seen. They explicitly state that they evaluate candidates on more than just grades. They look for evidence of resilience, creativity, and community engagement. Your involvement in ${studentProfile.ExtracurricularActivities[1]} would be particularly appealing to them.\n\n` +
              `These universities genuinely look beyond academic metrics and consider how you'll contribute to campus life. They want students who will participate actively in university clubs, events, and initiatives.`,
        flagged: false
      };
    }
    
    // Check for internship questions
    if (lowerQuestion.includes('internship') || lowerQuestion.includes('work')) {
      return {
        text: `Great question about internship opportunities! For ${studentProfile.Major} students like yourself, there are several exchange programs with excellent work integration.\n\n` +
              `Technical University of Munich has one of the best setups. They offer integrated internships with major companies like BMW, Siemens, and various tech startups. What's special about their program is that these internships are built into the curriculum, so you get academic credit while gaining professional experience. Many of these turn into job offers after graduation.\n\n` +
              `University of Toronto has an excellent co-op program that allows for part-time work during the semester. For ${studentProfile.Major} students, they have partnerships with both large tech companies and innovative startups in the Toronto tech corridor. The university's career center also provides specialized support for international students navigating the Canadian work environment.\n\n` +
              `National University of Singapore has incredibly strong industry connections in the tech sector. Singapore's status as a tech hub in Asia means there are abundant opportunities with both multinational corporations and local companies. The university runs specialized career fairs for computing students where companies actively recruit exchange students.\n\n` +
              `One important thing to be aware of is that work visa restrictions vary significantly by country. Some programs might require extending your stay beyond the exchange period to complete an internship. I'd recommend checking the specific visa requirements for each country you're considering.`,
        flagged: false
      };
    }
    
    // Default response for other questions
    return {
      text: `That's a really thoughtful question about ${question.substring(0, 30)}...\n\n` +
            `I want to make sure I give you the most accurate and personalized information possible. Your specific academic background, interests, and goals all play important roles in finding the right answer for you.\n\n` +
            `To provide you with truly tailored advice, I'd recommend scheduling a one-on-one consultation with one of our exchange program advisors who specializes in this area. They can dive deeper into your specific situation and provide more customized guidance.\n\n` +
            `Would you like me to help you set up an appointment? Our advisors typically have availability within the next week.`,
      flagged: true
    };
  };

  // Handle sending a message - optimized with useCallback
  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      loading: true
    };
    
    // Batch state updates for better performance
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Use requestAnimationFrame for smoother UI
    requestAnimationFrame(() => {
      // Reduced delay for faster response
      setTimeout(() => {
        // Get predefined answer
        const answer = getPredefinedAnswer(userMessage.text);
        
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text: answer.text,
          sender: 'bot',
          timestamp: new Date(),
          flagged: answer.flagged
        };
        
        // Single state update to remove loading and add new message
        setMessages(prev => prev.map(msg => msg.id === loadingMessage.id ? botMessage : msg));
        setIsTyping(false);
      }, 500); // Reduced to 500ms for faster response
    });
  }, [inputText]); // Proper dependency array
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Handle suggested question click - optimized with useCallback
  const handleSuggestedQuestion = useCallback((question: string) => {
    setInputText(question);
    // Focus on input after setting text
    requestAnimationFrame(() => {
      document.getElementById('chat-input')?.focus();
    });
  }, []);

  // Memoized suggested questions component
  const SuggestedQuestions = memo(({ questions }: { questions: string[] }) => (
    <div className="questions-list">
      {questions.map((question, index) => (
        <button 
          key={index} 
          className="suggested-question"
          onClick={() => handleSuggestedQuestion(question)}
        >
          {question}
        </button>
      ))}
    </div>
  ));

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="chatbot-info">
              <h2>Exchange Program Advisor</h2>
              <p>Personal Guidance & Support</p>
            </div>
          </div>
        </div>
        
        <div className="chat-messages">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="suggested-questions">
          <h3>Suggested Questions</h3>
          <SuggestedQuestions questions={suggestedQuestions} />
        </div>
        
        <div className="chat-input-container">
          <input
            id="chat-input"
            type="text"
            placeholder="Type your question here..."
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            autoComplete="off"
          />
          <button 
            className="send-button" 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            Send
          </button>
        </div>
        
        <div className="chatbot-footer">
          <p className="disclaimer">This advisor provides general guidance. For specific policy questions, please contact the exchange office.</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
