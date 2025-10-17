import os
import sys
import json
import re
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'GenAI_Version'))

try:
    from watsonx_official_matcher import WatsonXOfficialMatcher
    WATSONX_AVAILABLE = True
except ImportError:
    WATSONX_AVAILABLE = False

class GenAIConnector:
    def __init__(self, api_key=None, project_id=None):
        self.api_key = api_key
        # Try to load from config in GenAI_Version folder
        genai_config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'GenAI_Version')
        sys.path.append(genai_config_path)
        try:
            import config
            self.api_key = api_key or getattr(config, 'WATSON_API_KEY', None)
            self.project_id = project_id or getattr(config, 'WATSON_PROJECT_ID', None)
            print(f"Loaded API credentials from GenAI_Version/config.py")
        except ImportError:
            print(f"Could not import config from {genai_config_path}")
            pass
        
        # Initialize WatsonX if available
        self.model = None
        if WATSONX_AVAILABLE and self.api_key and self.project_id:
            try:
                # Get paths to the data files
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                student_data_path = os.path.join(base_dir, 'exchange_program_dataset_updated.csv')
                university_requirements_path = os.path.join(base_dir, 'university_requirements.csv')
                
                # Check if files exist
                if not os.path.exists(student_data_path):
                    print(f"Warning: Student data file not found at {student_data_path}")
                    student_data_path = ''
                
                if not os.path.exists(university_requirements_path):
                    print(f"Warning: University requirements file not found at {university_requirements_path}")
                    university_requirements_path = ''
                
                # Initialize with valid file paths
                self.model = WatsonXOfficialMatcher(
                    student_data_path=student_data_path,
                    university_requirements_path=university_requirements_path,
                    api_key=self.api_key,
                    project_id=self.project_id
                )
                print("WatsonX model initialized successfully for connection enhancement")
            except Exception as e:
                print(f"Error initializing WatsonX model: {e}")
                self.model = None
    
    def analyze_compatibility(self, student1, student2):
        if not self.model or not self.model.model:
            # Fallback to traditional method
            return self._traditional_compatibility(student1, student2)
        
        # Create a prompt for WatsonX
        prompt = self._create_compatibility_prompt(student1, student2)
        
        try:
            # Generate response using WatsonX
            response = self.model.model.generate(prompt=prompt)
            
            # Parse the response
            result = self._parse_compatibility_response(response)
            
            return result
        except Exception as e:
            print(f"Error generating compatibility analysis: {e}")
            # Fallback to traditional method
            return self._traditional_compatibility(student1, student2)
    
    def generate_conversation_starters(self, student1, student2):
        """
        Generate conversation starters for two students using GenAI
        
        Args:
            student1: Dictionary with student1 information
            student2: Dictionary with student2 information
            
        Returns:
            List of conversation starter suggestions
        """
        if not self.model or not self.model.model:
            # Fallback to traditional method
            return self._traditional_conversation_starters(student1, student2)
        
        # Create a prompt for WatsonX
        prompt = self._create_conversation_starters_prompt(student1, student2)
        
        try:
            # Generate response using WatsonX
            response = self.model.model.generate(prompt=prompt)
            
            # Parse the response
            result = self._parse_conversation_starters_response(response)
            
            return result
        except Exception as e:
            print(f"Error generating conversation starters: {e}")
            # Fallback to traditional method
            return self._traditional_conversation_starters(student1, student2)
    
    def generate_area_guide(self, area, interests=None):
        """
        Generate a personalized area guide using GenAI
        
        Args:
            area: String with the area name
            interests: Optional list of interests to personalize the guide
            
        Returns:
            Dictionary with area guide sections
        """
        if not self.model or not self.model.model:
            # Fallback to traditional method
            return self._traditional_area_guide(area, interests)
        
        # Create a prompt for WatsonX
        prompt = self._create_area_guide_prompt(area, interests)
        
        try:
            # Generate response using WatsonX
            response = self.model.model.generate(prompt=prompt)
            
            # Parse the response
            result = self._parse_area_guide_response(response)
            
            return result
        except Exception as e:
            print(f"Error generating area guide: {e}")
            # Fallback to traditional method
            return self._traditional_area_guide(area, interests)
    
    def _create_compatibility_prompt(self, student1, student2):
        """Create a prompt for compatibility analysis"""
        prompt = f"""
        You are an expert in student exchange programs and social compatibility analysis. Analyze the compatibility between these two students who will be part of the same exchange program.
        
        STUDENT 1 INFORMATION:
        - Name: {student1.get('name', 'Unknown')}
        - Home University: {student1.get('home_university', 'Unknown')}
        - Exchange University: {student1.get('exchange_university', 'Unknown')}
        - Major: {student1.get('major', 'Unknown')}
        - Interests: {', '.join(student1.get('interests', []))}
        - Languages: {', '.join(student1.get('languages', []))}
        
        STUDENT 2 INFORMATION:
        - Name: {student2.get('name', 'Unknown')}
        - Home University: {student2.get('home_university', 'Unknown')}
        - Exchange University: {student2.get('exchange_university', 'Unknown')}
        - Major: {student2.get('major', 'Unknown')}
        - Interests: {', '.join(student2.get('interests', []))}
        - Languages: {', '.join(student2.get('languages', []))}
        
        Analyze their compatibility based on:
        1. Shared interests
        2. Academic alignment
        3. Language compatibility
        4. Cultural exchange potential
        5. Overall match quality
        
        Provide a compatibility score from 1-10 and a brief explanation of why they would be good exchange partners.
        
        Format your response as follows:
        Score: [NUMBER]
        
        [EXPLANATION - 3-5 sentences covering the factors above]
        """
        return prompt
    
    def _parse_compatibility_response(self, response):
        """Parse the compatibility response from WatsonX"""
        try:
            # Get the generated text
            generated_text = response['results'][0]['generated_text']
            
            # Clean up the text - remove any control characters
            clean_text = ''.join(c if ord(c) >= 32 else ' ' for c in generated_text)
            
            # Extract score - look for patterns like "Score: 8"
            score_match = re.search(r'Score:\s*([0-9]|10)\b', clean_text, re.IGNORECASE)
            score = 5.0  # Default score
            
            if score_match:
                score_str = score_match.group(1)
                score = float(score_str)
            
            # Extract explanation - everything after the score line
            score_index = clean_text.lower().find('score:')
            explanation = "No detailed explanation provided."
            
            if score_index >= 0:
                # Find the end of the score line
                line_end = clean_text.find('\n', score_index)
                if line_end >= 0:
                    explanation = clean_text[line_end:].strip()
            
            return {
                "score": score,
                "explanation": explanation,
                "method": "genai"
            }
                
        except Exception as e:
            print(f"Error parsing compatibility response: {e}")
            return {
                "score": 5.0,
                "explanation": "Error in AI analysis. Using default score.",
                "method": "fallback"
            }
    
    def _traditional_compatibility(self, student1, student2):
        """Calculate compatibility using traditional algorithm"""
        # Calculate shared interests
        interests1 = set(student1.get('interests', []))
        interests2 = set(student2.get('interests', []))
        shared_interests = interests1.intersection(interests2)
        
        # Calculate shared languages
        languages1 = set(student1.get('languages', []))
        languages2 = set(student2.get('languages', []))
        shared_languages = languages1.intersection(languages2)
        
        # Calculate score components
        interest_score = len(shared_interests) * 2  # 0-10 points
        language_score = min(len(shared_languages) * 3, 10)  # 0-10 points
        
        # Same major bonus
        major_bonus = 2 if student1.get('major') == student2.get('major') else 0
        
        # Calculate final score (0-10)
        final_score = min((interest_score + language_score + major_bonus) / 3, 10)
        
        # Generate explanation
        explanation = f"Based on {len(shared_interests)} shared interests and {len(shared_languages)} common languages. "
        
        if shared_interests:
            explanation += f"Both students are interested in {', '.join(list(shared_interests)[:3])}. "
        
        if shared_languages:
            explanation += f"They can communicate in {', '.join(list(shared_languages))}. "
        
        if major_bonus > 0:
            explanation += f"They are both studying {student1.get('major')}, which provides additional common ground."
        
        return {
            "score": final_score,
            "explanation": explanation,
            "method": "traditional"
        }
    
    def _create_conversation_starters_prompt(self, student1, student2):
        """Create a prompt for conversation starters"""
        prompt = f"""
        You are an expert in student exchange programs and social interactions. Generate 5 conversation starters for these two students who will be part of the same exchange program.
        
        STUDENT 1 INFORMATION:
        - Name: {student1.get('name', 'Unknown')}
        - Home University: {student1.get('home_university', 'Unknown')}
        - Exchange University: {student1.get('exchange_university', 'Unknown')}
        - Major: {student1.get('major', 'Unknown')}
        - Interests: {', '.join(student1.get('interests', []))}
        
        STUDENT 2 INFORMATION:
        - Name: {student2.get('name', 'Unknown')}
        - Home University: {student2.get('home_university', 'Unknown')}
        - Exchange University: {student2.get('exchange_university', 'Unknown')}
        - Major: {student2.get('major', 'Unknown')}
        - Interests: {', '.join(student2.get('interests', []))}
        
        Generate 5 conversation starters that:
        1. Are specific to their shared interests or complementary interests
        2. Relate to their exchange experience
        3. Are open-ended and encourage discussion
        4. Are friendly and casual in tone
        5. Would help them build a connection
        
        Format your response as a numbered list of 5 conversation starters, one per line.
        """
        return prompt
    
    def _parse_conversation_starters_response(self, response):
        """Parse the conversation starters response from WatsonX"""
        try:
            # Get the generated text
            generated_text = response['results'][0]['generated_text']
            
            # Clean up the text
            clean_text = ''.join(c if ord(c) >= 32 else ' ' for c in generated_text)
            
            # Extract conversation starters - look for numbered lines
            starters = []
            lines = clean_text.split('\n')
            
            for line in lines:
                # Look for lines that start with a number
                if re.match(r'^\s*\d+[\.\)]\s+', line):
                    # Remove the number and any leading/trailing whitespace
                    starter = re.sub(r'^\s*\d+[\.\)]\s+', '', line).strip()
                    if starter:
                        starters.append(starter)
            
            # If no starters found or parsing failed, return default
            if not starters:
                return self._traditional_conversation_starters(student1, student2)
            
            return {
                "starters": starters[:5],  # Limit to 5 starters
                "method": "genai"
            }
                
        except Exception as e:
            print(f"Error parsing conversation starters response: {e}")
            return self._traditional_conversation_starters(student1, student2)
    
    def _traditional_conversation_starters(self, student1, student2):
        """Generate conversation starters using traditional algorithm"""
        starters = []
        
        # Get interests
        interests1 = student1.get('interests', [])
        interests2 = student2.get('interests', [])
        shared_interests = set(interests1).intersection(set(interests2))
        
        # Add starter based on shared interests
        if shared_interests:
            interest = list(shared_interests)[0]
            starters.append(f"I see we're both interested in {interest}! What got you into that?")
        
        # Add starter based on exchange universities
        uni1 = student1.get('exchange_university', 'your exchange university')
        uni2 = student2.get('home_university', 'your university')
        starters.append(f"What are you most looking forward to about studying at {uni1}?")
        starters.append(f"I'd love to hear more about {uni2}. What should I know before I arrive?")
        
        # Add starter based on majors
        major1 = student1.get('major', 'your field')
        starters.append(f"What made you decide to study {major1}?")
        
        # Add general starter
        starters.append("Have you done any research on housing options or areas to live?")
        
        return {
            "starters": starters,
            "method": "traditional"
        }
    
    def _create_area_guide_prompt(self, area, interests=None):
        """Create a prompt for area guide"""
        interests_text = ""
        if interests:
            interests_text = f"The student is particularly interested in: {', '.join(interests)}."
        
        prompt = f"""
        You are an expert in student exchange programs and local area knowledge. Create a brief guide for a student going to {area} for an exchange program.
        
        {interests_text}
        
        Include the following sections:
        1. Transportation: How to get around the area
        2. Housing: Recommended areas for student housing
        3. Food: Must-try local food and budget-friendly options
        4. Activities: Things to do and see in the area
        5. Tips: Practical advice for living in the area
        
        Keep each section brief but informative, with 2-3 specific recommendations per section.
        
        Format your response with clear section headings.
        """
        return prompt
    
    def _parse_area_guide_response(self, response):
        """Parse the area guide response from WatsonX"""
        try:
            # Get the generated text
            generated_text = response['results'][0]['generated_text']
            
            # Clean up the text
            clean_text = ''.join(c if ord(c) >= 32 else ' ' for c in generated_text)
            
            # Extract sections
            sections = {}
            current_section = None
            current_content = []
            
            lines = clean_text.split('\n')
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check if this is a section header
                lower_line = line.lower()
                if "transportation" in lower_line or "getting around" in lower_line:
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = "Transportation"
                    current_content = []
                elif "housing" in lower_line or "accommodation" in lower_line:
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = "Housing"
                    current_content = []
                elif "food" in lower_line or "dining" in lower_line or "cuisine" in lower_line:
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = "Food"
                    current_content = []
                elif "activities" in lower_line or "things to do" in lower_line:
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = "Activities"
                    current_content = []
                elif "tips" in lower_line or "advice" in lower_line:
                    if current_section:
                        sections[current_section] = '\n'.join(current_content)
                    current_section = "Tips"
                    current_content = []
                elif current_section:
                    # Add content to current section
                    current_content.append(line)
            
            # Add the last section
            if current_section and current_content:
                sections[current_section] = '\n'.join(current_content)
            
            # If no sections found or parsing failed, return default
            if not sections:
                return self._traditional_area_guide(area, interests)
            
            return {
                "sections": sections,
                "method": "genai"
            }
                
        except Exception as e:
            print(f"Error parsing area guide response: {e}")
            return self._traditional_area_guide(area, interests)
    
    def _traditional_area_guide(self, area, interests=None):
        """Generate area guide using traditional algorithm"""
        # Default guides for common areas
        area_guides = {
            "San Francisco Bay Area": {
                "Transportation": "Use BART for travel between cities. Caltrain connects San Francisco to South Bay. Uber/Lyft are widely available.",
                "Housing": "Consider Berkeley, Oakland, or Mission District for more affordable options. University housing is recommended if available.",
                "Food": "Try the diverse food scene in SF's Mission District. Berkeley has many affordable student-friendly restaurants.",
                "Activities": "Visit Golden Gate Park, explore Silicon Valley tech campuses, and hike in Muir Woods.",
                "Tips": "Weather varies dramatically between SF and South Bay. Always carry layers. Get a Clipper card for public transit."
            },
            "Greater Boston": {
                "Transportation": "The T (subway) is the main public transit. Charlie Card saves money on fares. Buses connect areas not served by the T.",
                "Housing": "Allston, Brighton, and Somerville are popular with students. Start housing search early as competition is high.",
                "Food": "Try local seafood, especially clam chowder. Many student discounts available with university ID.",
                "Activities": "Walk the Freedom Trail, visit museums (many have free student days), and attend Red Sox games at Fenway.",
                "Tips": "Winters are harsh - invest in proper clothing. Many coffee shops offer good study spaces."
            },
            "Tokyo Metropolitan Area": {
                "Transportation": "Get a Suica or Pasmo card for trains and buses. The JR Yamanote Line circles central Tokyo and connects major areas.",
                "Housing": "University housing is recommended. For private options, look at share houses or apartments in Kichijoji or Nakano.",
                "Food": "Try conveyor belt sushi for affordable meals. Convenience stores (konbini) have quality, inexpensive food.",
                "Activities": "Visit Shibuya Crossing, explore Akihabara for electronics, and take day trips to nearby Yokohama or Kamakura.",
                "Tips": "Learn basic Japanese phrases. Download Google Translate and Japan Transit Planner apps."
            },
            "Greater London": {
                "Transportation": "Get an Oyster card for the Tube and buses. Consider a student Oyster for discounts.",
                "Housing": "Look for accommodation in Zones 2-3 for better prices. University housing is often the most affordable option.",
                "Food": "Try local markets like Borough Market. Meal deals at supermarkets offer good value.",
                "Activities": "Many museums are free. Take advantage of student discounts for West End shows.",
                "Tips": "Always carry an umbrella. Download Citymapper app for navigation."
            }
        }
        
        # Return guide for the specified area, or a generic guide if not found
        if area in area_guides:
            return {
                "sections": area_guides[area],
                "method": "traditional"
            }
        else:
            return {
                "sections": {
                    "Transportation": "Research local public transportation options. Consider getting a transit card for regular use.",
                    "Housing": "University housing is often the most affordable and convenient option for exchange students.",
                    "Food": "Try local cuisine and look for student discounts. Grocery shopping and cooking can save money.",
                    "Activities": "Explore local attractions and join university clubs to meet people.",
                    "Tips": "Connect with other exchange students and locals to get insider knowledge."
                },
                "method": "traditional"
            }
