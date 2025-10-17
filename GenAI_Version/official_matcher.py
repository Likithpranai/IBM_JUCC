import pandas as pd
import numpy as np
import re
import json
import os
import getpass
from fuzzywuzzy import fuzz

# Import the IBM WatsonX API client
try:
    from ibm_watsonx_ai import APIClient
    from ibm_watsonx_ai import Credentials
    from ibm_watsonx_ai.foundation_models import ModelInference
    WATSONX_AVAILABLE = True
except ImportError:
    print("IBM WatsonX AI SDK not installed. To install, run: pip install ibm-watsonx-ai")
    WATSONX_AVAILABLE = False

class WatsonXOfficialMatcher:
    def __init__(self, student_data_path, university_requirements_path, project_id=None, api_key=None):
        """
        Initialize the WatsonX Official Matcher with student and university data
        
        Args:
            student_data_path: Path to the CSV file containing student data
            university_requirements_path: Path to the CSV file containing university requirements
            project_id: Project ID for IBM Watson service (optional)
            api_key: API key for IBM Watson service (optional)
        """
        self.students_df = pd.read_csv(student_data_path)
        self.universities_df = pd.read_csv(university_requirements_path)
        
        # Try to get credentials from config file or environment variables
        try:
            import config
            self.project_id = project_id or getattr(config, 'WATSON_PROJECT_ID', None) or os.environ.get("WATSON_PROJECT_ID")
            self.api_key = api_key or getattr(config, 'WATSON_API_KEY', None) or os.environ.get("WATSON_API_KEY")
        except ImportError:
            self.project_id = project_id or os.environ.get("WATSON_PROJECT_ID")
            self.api_key = api_key or os.environ.get("WATSON_API_KEY")
        
        # Initialize WatsonX model if available
        self.model = None
        if WATSONX_AVAILABLE and self.api_key:
            try:
                # Set up credentials
                # Try to get URL from config or environment
                try:
                    import config
                    url = getattr(config, 'WATSON_API_URL', None) or os.environ.get("WATSON_API_URL", "https://us-south.ml.cloud.ibm.com")
                except ImportError:
                    url = os.environ.get("WATSON_API_URL", "https://us-south.ml.cloud.ibm.com")
                
                credentials = Credentials(
                    url=url,
                    api_key=self.api_key
                )
                
                # Create API client
                client = APIClient(credentials)
                
                # Set parameters
                params = {
                    "decoding_method": "greedy",  # Use greedy decoding for more consistent responses
                    "temperature": 0.3,  # Lower temperature for more consistent responses
                    "max_new_tokens": 300,  # Reduced token limit for shorter explanations
                    "repetition_penalty": 1.1  # Prevent repetitive text
                }
                
                # Initialize model
                self.model = ModelInference(
                    model_id="ibm/granite-3-3-8b-instruct",
                    api_client=client,
                    project_id=self.project_id,
                    params=params
                )
                
                print("WatsonX model initialized successfully")
            except Exception as e:
                print(f"Error initializing WatsonX model: {e}")
                self.model = None
        
        # Field weights for traditional scoring (fallback)
        self.field_weights = {
            'gpa': 0.3,
            'ielts': 0.2,
            'extracurriculars': 0.2,
            'credit_transfer': 0.3
        }
    
    def parse_extracurriculars(self, extracurriculars_str):
        """Parse the extracurriculars string into a list of activities"""
        if pd.isna(extracurriculars_str):
            return []
        
        activities = extracurriculars_str.split('), ')
        activities = [a.strip() for a in activities]
        activities = [re.sub(r' -> \(.*$', '', a) for a in activities]
        
        # Clean up the last item which might have a trailing parenthesis
        if activities and activities[-1].endswith(')'):
            activities[-1] = re.sub(r' -> \(.*\)$', '', activities[-1])
            
        return activities
    
    def parse_credit_transfers(self, credit_transfer_str):
        """Parse the credit transfer string into a list of course codes"""
        if pd.isna(credit_transfer_str):
            return []
            
        courses = credit_transfer_str.split(', ')
        courses = [c.strip() for c in courses]
        return courses
    
    def analyze_with_watsonx(self, student_data, university_data):
        """
        Use IBM WatsonX to analyze the match between student and university
        
        Args:
            student_data: Dictionary containing student information
            university_data: Dictionary containing university requirements
            
        Returns:
            score: Float between 0 and 1 representing match quality
            explanation: String with detailed explanation
        """
        if not self.model:
            # Fallback to traditional scoring if model not available
            return self.calculate_traditional_match(student_data, university_data)
        
        try:
            # Prepare prompt for WatsonX
            prompt = self._create_watsonx_prompt(student_data, university_data)
            
            # Generate response using WatsonX
            response = self.model.generate(prompt)
            
            # Parse the response
            return self._parse_watsonx_response(response)
                
        except Exception as e:
            print(f"Error using WatsonX: {e}")
            # Fallback to traditional scoring
            return self.calculate_traditional_match(student_data, university_data)
    
    def _create_watsonx_prompt(self, student, university):
        """Create a prompt for WatsonX to analyze the match"""
        prompt = f"""
        You are a university admissions expert specializing in exchange program matching. Your task is to analyze how well a student matches with university requirements and provide a score from 0-10 and a detailed explanation.
        
        STUDENT INFORMATION:
        - Name: {student['First Name']} {student['Last Name']}
        - GPA: {student['GPA']}
        - IELTS Score: {student['IELTS']}
        - Extracurricular Activities: {student['Extra Co-Curriculars']}
        - Credit Transfer Courses: {student['Credit Transfer Requirement']}
        
        UNIVERSITY REQUIREMENTS:
        - University: {university['University Name']}
        - Minimum GPA: {university['Min GPA']}
        - Minimum IELTS: {university['Min IELTS']}
        - Required Extracurriculars: {university['Required Extracurriculars']}
        - Engineering Credit Transfer: {university['Engineering Credit Transfer']}
        - Science Credit Transfer: {university['Science Credit Transfer']}
        - Business Credit Transfer: {university['Business Credit Transfer']}
        - Additional Requirements: {university['Additional Requirements']}
        
        Provide a CONCISE analysis that covers ALL of the following factors in simple sentences:
        1. GPA: Compare the student's GPA to the university's minimum requirement.
        2. IELTS: Compare the student's IELTS score to the minimum requirement.
        3. Extracurriculars: Analyze if the student's activities meet the university's requirements.
        4. Credit Transfer: Briefly evaluate the student's courses for this university.
        5. Additional Requirements: Note any other requirements mentioned for this university.
        
        Begin with a numerical score from 0-10 that reflects the overall match quality, then provide your analysis.
        
        Format your response as follows:
        Score: [NUMBER]
        
        [EXPLANATION - 3-5 simple sentences covering all five factors above]
        """
        return prompt
    
    def _parse_watsonx_response(self, response):
        """Parse WatsonX's response to extract score and explanation"""
        try:
            # Get the generated text
            generated_text = response['results'][0]['generated_text']
            
            # Clean up the text - remove any control characters that might break parsing
            clean_text = ''.join(c if ord(c) >= 32 else ' ' for c in generated_text)
            
            # Extract score - look for patterns like "Score: 8" or "8/10"
            score_patterns = [
                r'Score:\s*([0-9]|10)\b',  # Score: 8
                r'\b([0-9]|10)/10\b',     # 8/10
                r'\bscore\s*[of|is]*\s*([0-9]|10)\b',  # score of 8
                r'\b([0-9]|10)\s*out of\s*10\b'  # 8 out of 10
            ]
            
            score = 5.0  # Default score
            for pattern in score_patterns:
                match = re.search(pattern, clean_text, re.IGNORECASE)
                if match:
                    # Extract the number from the matched group
                    score_str = match.group(1) if len(match.groups()) > 0 else match.group(0)
                    # Extract just the digits
                    score_digits = re.search(r'([0-9]|10)', score_str)
                    if score_digits:
                        score = float(score_digits.group(0))
                        break
            
            # Extract explanation - everything after the score line
            score_index = clean_text.lower().find('score:')
            if score_index >= 0:
                # Find the end of the score line
                line_end = clean_text.find('\n', score_index)
                if line_end >= 0:
                    explanation = clean_text[line_end:].strip()
                    # If explanation is too short, use the whole text
                    if len(explanation) < 50:
                        explanation = clean_text.strip()
                else:
                    explanation = clean_text.strip()
            else:
                # If no score line found, use the whole text as explanation
                explanation = clean_text.strip()
                
            # If explanation is still too short, add a note
            if len(explanation.strip()) < 50:
                explanation = "The student has a good match with this university. Please consider GPA, IELTS score, extracurricular activities, and credit transfer potential."
            
            return score / 10.0, explanation
                
        except Exception as e:
            print(f"Error parsing WatsonX response: {e}")
            return 0.5, "Error in AI analysis. Using default score."
    
    def calculate_traditional_match(self, student, university):
        """
        Calculate match score using traditional algorithm (fallback method)
        
        Args:
            student: Dictionary containing student data
            university: Dictionary containing university requirements
            
        Returns:
            score: Float between 0 and 1 representing match quality
            explanation: String with explanation
        """
        explanations = []
        
        # GPA comparison
        gpa_score = 0
        student_gpa = float(student['GPA'])
        min_gpa = float(university['Min GPA'])
        
        if student_gpa >= min_gpa:
            gpa_score = min(1.0, student_gpa / min_gpa)
            if student_gpa > min_gpa + 0.5:
                explanations.append(f"Your GPA of {student_gpa} significantly exceeds the minimum requirement of {min_gpa}.")
            else:
                explanations.append(f"Your GPA of {student_gpa} meets the minimum requirement of {min_gpa}.")
        else:
            gpa_score = max(0, 0.7 * (student_gpa / min_gpa))
            deficit = min_gpa - student_gpa
            if deficit > 0.5:
                explanations.append(f"Your GPA of {student_gpa} is significantly below the minimum requirement of {min_gpa}.")
            else:
                explanations.append(f"Your GPA of {student_gpa} is slightly below the minimum requirement of {min_gpa}.")
        
        # IELTS comparison
        ielts_score = 0
        student_ielts = float(student['IELTS'])
        min_ielts = float(university['Min IELTS'])
        
        if student_ielts >= min_ielts:
            ielts_score = min(1.0, student_ielts / min_ielts)
            if student_ielts > min_ielts + 1:
                explanations.append(f"Your IELTS score of {student_ielts} significantly exceeds the minimum requirement of {min_ielts}.")
            else:
                explanations.append(f"Your IELTS score of {student_ielts} meets the minimum requirement of {min_ielts}.")
        else:
            ielts_score = max(0, 0.7 * (student_ielts / min_ielts))
            deficit = min_ielts - student_ielts
            if deficit > 0.5:
                explanations.append(f"Your IELTS score of {student_ielts} is below the minimum requirement of {min_ielts}.")
            else:
                explanations.append(f"Your IELTS score of {student_ielts} is slightly below the minimum requirement of {min_ielts}.")
        
        # Extracurriculars comparison
        extracurriculars_score = 0
        student_extracurriculars = self.parse_extracurriculars(student['Extra Co-Curriculars'])
        required_extracurriculars = int(university['Required Extracurriculars'])
        
        if len(student_extracurriculars) >= required_extracurriculars:
            extracurriculars_score = min(1.0, len(student_extracurriculars) / required_extracurriculars)
            if len(student_extracurriculars) > required_extracurriculars + 1:
                explanations.append(f"Your {len(student_extracurriculars)} extracurricular activities exceed the minimum requirement of {required_extracurriculars}.")
            else:
                explanations.append(f"Your {len(student_extracurriculars)} extracurricular activities meet the minimum requirement of {required_extracurriculars}.")
        else:
            extracurriculars_score = max(0, 0.7 * (len(student_extracurriculars) / required_extracurriculars))
            explanations.append(f"You have {len(student_extracurriculars)} extracurricular activities, which is below the minimum requirement of {required_extracurriculars}.")
        
        # Credit transfer comparison
        student_courses = self.parse_credit_transfers(student['Credit Transfer Requirement'])
        
        # Simple field detection
        extracurriculars_text = student['Extra Co-Curriculars'].lower() if not pd.isna(student['Extra Co-Curriculars']) else ""
        
        if any(keyword in extracurriculars_text for keyword in ['engineering', 'robot', 'design', 'tech']):
            field = 'Engineering Credit Transfer'
        elif any(keyword in extracurriculars_text for keyword in ['science', 'biology', 'chemistry', 'physics', 'lab']):
            field = 'Science Credit Transfer'
        else:
            field = 'Business Credit Transfer'
        
        university_courses = self.parse_credit_transfers(university[field])
        
        # Calculate overlap
        if not student_courses or not university_courses:
            credit_transfer_score = 0
        else:
            student_course_set = set(student_courses)
            university_course_set = set(university_courses)
            overlap = len(student_course_set.intersection(university_course_set))
            credit_transfer_score = min(1.0, overlap / len(student_course_set)) if len(student_course_set) > 0 else 0
        
        if credit_transfer_score > 0.8:
            explanations.append(f"Excellent credit transfer potential for your courses in the {field.split(' ')[0]} field.")
        elif credit_transfer_score > 0.5:
            explanations.append(f"Good credit transfer potential for your courses in the {field.split(' ')[0]} field.")
        elif credit_transfer_score > 0.3:
            explanations.append(f"Limited credit transfer potential for your courses in the {field.split(' ')[0]} field.")
        else:
            explanations.append(f"Very limited credit transfer potential for your courses in the {field.split(' ')[0]} field.")
        
        # Add additional requirements context
        if not pd.isna(university['Additional Requirements']):
            explanations.append(f"Note: {university['Additional Requirements']}")
        
        # Calculate weighted score
        weighted_score = (
            self.field_weights['gpa'] * gpa_score +
            self.field_weights['ielts'] * ielts_score +
            self.field_weights['extracurriculars'] * extracurriculars_score +
            self.field_weights['credit_transfer'] * credit_transfer_score
        )
        
        return weighted_score, " ".join(explanations)
    
    def generate_ranking(self, student_index=None, student_data=None):
        """
        Generate university rankings for a student using WatsonX
        
        Args:
            student_index: Index of the student in the dataframe (if using existing data)
            student_data: Dictionary containing student data (if providing new data)
            
        Returns:
            rankings: List of dictionaries with university rankings and explanations
        """
        if student_data is None and student_index is not None:
            student_data = self.students_df.iloc[student_index].to_dict()
        elif student_data is None:
            raise ValueError("Either student_index or student_data must be provided")
        
        # Extract student's top 10 universities
        top_10_universities = student_data['Top 10'].split(', ')
        
        rankings = []
        
        for uni_name in top_10_universities:
            # Find the university in the requirements dataframe
            uni_data = self.universities_df[self.universities_df['University Name'] == uni_name]
            
            if len(uni_data) == 0:
                # University not found in requirements database
                rankings.append({
                    'university': uni_name,
                    'rank': 0,
                    'explanation': "University requirements data not available."
                })
                continue
            
            uni_requirements = uni_data.iloc[0].to_dict()
            
            # Use WatsonX to analyze the match
            score, explanation = self.analyze_with_watsonx(student_data, uni_requirements)
            
            # Convert score to 0-10 scale and round to nearest integer
            rank = round(score * 10)
            
            rankings.append({
                'university': uni_name,
                'rank': rank,
                'explanation': explanation
            })
        
        # Sort rankings by rank in descending order
        rankings = sorted(rankings, key=lambda x: x['rank'], reverse=True)
        
        return rankings

    def evaluate_new_student(self, student_data):
        """
        Evaluate a new student against all universities using WatsonX
        
        Args:
            student_data: Dictionary containing student data
            
        Returns:
            rankings: List of dictionaries with university rankings and explanations
        """
        return self.generate_ranking(student_data=student_data)


def main():
    """Main function to demonstrate the WatsonX Official matcher"""
    print("=" * 80)
    print("WATSONX OFFICIAL UNIVERSITY MATCHER DEMO")
    print("=" * 80)
    
    # Initialize the matcher
    matcher = WatsonXOfficialMatcher(
        student_data_path='../exchange_program_dataset_updated.csv',
        university_requirements_path='../university_requirements.csv'
    )
    
    # Example: Generate rankings for the first student
    student_rankings = matcher.generate_ranking(student_index=0)
    
    print(f"Rankings for {matcher.students_df.iloc[0]['First Name']} {matcher.students_df.iloc[0]['Last Name']}:")
    for ranking in student_rankings:
        print(f"\n{ranking['university']}: {ranking['rank']}/10")
        print(f"Explanation: {ranking['explanation']}")


if __name__ == "__main__":
    main()
