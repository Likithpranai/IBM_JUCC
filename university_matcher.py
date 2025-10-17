import pandas as pd
import numpy as np
import re
from fuzzywuzzy import fuzz
import json

class UniversityMatcher:
    def __init__(self, student_data_path, university_requirements_path):
        self.students_df = pd.read_csv(student_data_path)
        self.universities_df = pd.read_csv(university_requirements_path)
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
        
    def calculate_credit_transfer_score(self, student_courses, university_courses):
        """Calculate the credit transfer score based on course overlap"""
        if not student_courses or not university_courses:
            return 0
            
        # Convert to sets for easier intersection calculation
        student_course_set = set(student_courses)
        university_course_set = set(university_courses)
        
        # Calculate overlap
        overlap = len(student_course_set.intersection(university_course_set))
        
        # Calculate score based on percentage of student courses that can be transferred
        if len(student_course_set) == 0:
            return 0
            
        return min(1.0, overlap / len(student_course_set))
    
    def calculate_university_match(self, student, university):
        """
        Calculate the match score between a student and a university
        
        Args:
            student: Dictionary containing student data
            university: Dictionary containing university requirements
            
        Returns:
            score: Float between 0 and 1 representing match quality
            explanation: Dictionary with explanations for each component
        """
        explanations = {}
        
        # GPA comparison
        gpa_score = 0
        student_gpa = float(student['GPA'])
        min_gpa = float(university['Min GPA'])
        
        if student_gpa >= min_gpa:
            # If GPA meets or exceeds requirement, scale score based on how much it exceeds
            gpa_score = min(1.0, student_gpa / min_gpa)
            if student_gpa > min_gpa + 0.5:
                explanations['gpa'] = f"Your GPA of {student_gpa} significantly exceeds the minimum requirement of {min_gpa}."
            else:
                explanations['gpa'] = f"Your GPA of {student_gpa} meets the minimum requirement of {min_gpa}."
        else:
            # If GPA is below requirement, scale score based on how close it is
            gpa_score = max(0, 0.7 * (student_gpa / min_gpa))
            deficit = min_gpa - student_gpa
            if deficit > 0.5:
                explanations['gpa'] = f"Your GPA of {student_gpa} is significantly below the minimum requirement of {min_gpa}."
            else:
                explanations['gpa'] = f"Your GPA of {student_gpa} is slightly below the minimum requirement of {min_gpa}."
        
        # IELTS comparison
        ielts_score = 0
        student_ielts = float(student['IELTS'])
        min_ielts = float(university['Min IELTS'])
        
        if student_ielts >= min_ielts:
            # If IELTS meets or exceeds requirement, scale score based on how much it exceeds
            ielts_score = min(1.0, student_ielts / min_ielts)
            if student_ielts > min_ielts + 1:
                explanations['ielts'] = f"Your IELTS score of {student_ielts} significantly exceeds the minimum requirement of {min_ielts}."
            else:
                explanations['ielts'] = f"Your IELTS score of {student_ielts} meets the minimum requirement of {min_ielts}."
        else:
            # If IELTS is below requirement, scale score based on how close it is
            ielts_score = max(0, 0.7 * (student_ielts / min_ielts))
            deficit = min_ielts - student_ielts
            if deficit > 0.5:
                explanations['ielts'] = f"Your IELTS score of {student_ielts} is below the minimum requirement of {min_ielts}."
            else:
                explanations['ielts'] = f"Your IELTS score of {student_ielts} is slightly below the minimum requirement of {min_ielts}."
        
        # Extracurriculars comparison
        extracurriculars_score = 0
        student_extracurriculars = self.parse_extracurriculars(student['Extra Co-Curriculars'])
        required_extracurriculars = int(university['Required Extracurriculars'])
        
        if len(student_extracurriculars) >= required_extracurriculars:
            extracurriculars_score = min(1.0, len(student_extracurriculars) / required_extracurriculars)
            if len(student_extracurriculars) > required_extracurriculars + 1:
                explanations['extracurriculars'] = f"Your {len(student_extracurriculars)} extracurricular activities exceed the minimum requirement of {required_extracurriculars}."
            else:
                explanations['extracurriculars'] = f"Your {len(student_extracurriculars)} extracurricular activities meet the minimum requirement of {required_extracurriculars}."
        else:
            extracurriculars_score = max(0, 0.7 * (len(student_extracurriculars) / required_extracurriculars))
            explanations['extracurriculars'] = f"You have {len(student_extracurriculars)} extracurricular activities, which is below the minimum requirement of {required_extracurriculars}."
        
        # Credit transfer comparison
        # Determine which field to use based on a simple keyword analysis of extracurriculars
        student_courses = self.parse_credit_transfers(student['Credit Transfer Requirement'])
        
        # Simple field detection - could be enhanced with NLP
        extracurriculars_text = student['Extra Co-Curriculars'].lower() if not pd.isna(student['Extra Co-Curriculars']) else ""
        
        if any(keyword in extracurriculars_text for keyword in ['engineering', 'robot', 'design', 'tech']):
            field = 'Engineering Credit Transfer'
        elif any(keyword in extracurriculars_text for keyword in ['science', 'biology', 'chemistry', 'physics', 'lab']):
            field = 'Science Credit Transfer'
        else:
            field = 'Business Credit Transfer'
        
        university_courses = self.parse_credit_transfers(university[field])
        credit_transfer_score = self.calculate_credit_transfer_score(student_courses, university_courses)
        
        if credit_transfer_score > 0.8:
            explanations['credit_transfer'] = f"Excellent credit transfer potential for your courses in the {field.split(' ')[0]} field."
        elif credit_transfer_score > 0.5:
            explanations['credit_transfer'] = f"Good credit transfer potential for your courses in the {field.split(' ')[0]} field."
        elif credit_transfer_score > 0.3:
            explanations['credit_transfer'] = f"Limited credit transfer potential for your courses in the {field.split(' ')[0]} field."
        else:
            explanations['credit_transfer'] = f"Very limited credit transfer potential for your courses in the {field.split(' ')[0]} field."
        
        # Calculate weighted score
        weighted_score = (
            self.field_weights['gpa'] * gpa_score +
            self.field_weights['ielts'] * ielts_score +
            self.field_weights['extracurriculars'] * extracurriculars_score +
            self.field_weights['credit_transfer'] * credit_transfer_score
        )
        
        # Add additional requirements context
        if not pd.isna(university['Additional Requirements']):
            explanations['additional'] = f"Note: {university['Additional Requirements']}"
        
        return weighted_score, explanations
    
    def generate_ranking(self, student_index=None, student_data=None):
        """
        Generate university rankings for a student
        
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
            
            # Calculate match score and get explanations
            score, explanations = self.calculate_university_match(student_data, uni_requirements)
            
            # Convert score to 0-10 scale and round to nearest integer
            rank = round(score * 10)
            
            # Generate overall explanation
            overall_explanation = []
            for key, explanation in explanations.items():
                overall_explanation.append(explanation)
            
            rankings.append({
                'university': uni_name,
                'rank': rank,
                'explanation': " ".join(overall_explanation)
            })
        
        # Sort rankings by rank in descending order
        rankings = sorted(rankings, key=lambda x: x['rank'], reverse=True)
        
        return rankings

    def evaluate_new_student(self, student_data):
        """
        Evaluate a new student against all universities
        
        Args:
            student_data: Dictionary containing student data
            
        Returns:
            rankings: List of dictionaries with university rankings and explanations
        """
        return self.generate_ranking(student_data=student_data)


def main():
    """Main function to demonstrate the university matcher"""
    matcher = UniversityMatcher(
        student_data_path='exchange_program_dataset_updated.csv',
        university_requirements_path='university_requirements.csv'
    )
    
    # Example: Generate rankings for the first student
    student_rankings = matcher.generate_ranking(student_index=0)
    
    print(f"Rankings for {matcher.students_df.iloc[0]['First Name']} {matcher.students_df.iloc[0]['Last Name']}:")
    for ranking in student_rankings:
        print(f"\n{ranking['university']}: {ranking['rank']}/10")
        print(f"Explanation: {ranking['explanation']}")
    
    # Example: Evaluate a new student
    new_student = {
        'First Name': 'Jane',
        'Last Name': 'Doe',
        'Sex': 'Female',
        'Email': 'jane.doe@example.com',
        'GPA': '3.7',
        'IELTS': '8.0',
        'Top 10': 'University of Cambridge, MIT, Stanford, University of Oxford, Imperial College London',
        'Consent': 'Yes',
        'Extra Co-Curriculars': 'Debate Team -> (Captain), Volunteer Work -> (300 hours), Research -> (Published paper)',
        'Credit Transfer Requirement': 'MATH 14100, PHYS 9010, CHEM 10100, BIOL 9010, ISOM 17700'
    }
    
    print("\n\nEvaluating a new student:")
    new_student_rankings = matcher.evaluate_new_student(new_student)
    
    for ranking in new_student_rankings:
        print(f"\n{ranking['university']}: {ranking['rank']}/10")
        print(f"Explanation: {ranking['explanation']}")


if __name__ == "__main__":
    main()
