import pandas as pd
import numpy as np
import re
import json
import os
from fuzzywuzzy import fuzz

# Import the IBM WatsonX SDK
try:
    from ibm_watsonx_ai.foundation_models import ModelInference
    from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
    from ibm_watson_machine_learning.foundation_models.utils.enums import ModelTypes
    WATSONX_SDK_AVAILABLE = True
except ImportError:
    print("IBM WatsonX SDK not installed. To install, run: pip install ibm-watsonx-ai ibm-watson-machine-learning")
    WATSONX_SDK_AVAILABLE = False

class WatsonXSDKMatcher:
    def __init__(self, student_data_path, university_requirements_path, project_id=None, api_key=None):
        """
        Initialize the WatsonX SDK Matcher with student and university data
        
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
        
        # Initialize WatsonX model if SDK is available
        self.model = None
        if WATSONX_SDK_AVAILABLE and self.project_id and self.api_key:
            try:
                os.environ["WATSONX_APIKEY"] = self.api_key
                self.model = ModelInference(
                    model_id="ibm/granite-3-3-8b-instruct",
                    project_id=self.project_id
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
            
            # Set parameters for generation
            params = {
                GenParams.DECODING_METHOD: "greedy",
                GenParams.MAX_NEW_TOKENS: 500,
                GenParams.MIN_NEW_TOKENS: 100,
                GenParams.TEMPERATURE: 0.7,
                GenParams.REPETITION_PENALTY: 1.1
            }
            
            # Generate response
            response = self.model.generate(prompt=prompt, params=params)
            
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
        
        Consider the following factors in your evaluation:
        1. How the student's GPA compares to the university's minimum requirement
        2. How the student's IELTS score compares to the minimum requirement
        3. Whether the student has sufficient extracurricular activities
        4. The potential for credit transfer based on the student's courses
        5. Any additional requirements or preferences of the university
        
        Provide your response in the following JSON format:
        {{
            "score": [a number between 0 and 10],
            "explanation": [a detailed explanation of the match quality, considering all factors]
        }}
        """
        return prompt
    
    def _parse_watsonx_response(self, response):
        """Parse WatsonX's response to extract score and explanation"""
        try:
            # Get the generated text
            generated_text = response['results'][0]['generated_text']
            
            # Find JSON content in the response
            json_start = generated_text.find('{')
            json_end = generated_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_content = generated_text[json_start:json_end]
                result = json.loads(json_content)
                
                score = float(result.get("score", 5.0))
                explanation = result.get("explanation", "No explanation provided.")
                
                return score / 10.0, explanation  # Convert to 0-1 scale
            else:
                # If no JSON found, try to extract score and explanation from text
                lines = generated_text.strip().split('\n')
                score_line = next((line for line in lines if 'score' in line.lower()), None)
                
                if score_line:
                    # Try to extract score (assuming format like "Score: 8/10")
                    score_match = re.search(r'\b([0-9]|10)\b', score_line)
                    if score_match:
                        score = float(score_match.group(0))
                    else:
                        score = 5.0
                else:
                    score = 5.0
                
                # Use the rest of the text as explanation
                explanation = generated_text
                
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
    """Main function to demonstrate the WatsonX SDK matcher"""
    print("=" * 80)
    print("WATSONX SDK UNIVERSITY MATCHER DEMO")
    print("=" * 80)
    
    # Initialize the matcher
    matcher = WatsonXSDKMatcher(
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
