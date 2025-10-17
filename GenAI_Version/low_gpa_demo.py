#!/usr/bin/env python3
"""
Demo script to run WatsonX matcher on a student with low GPA
"""
import os
import sys
import pandas as pd
from watsonx_official_matcher import WatsonXOfficialMatcher

def run_low_gpa_demo():
    """Run a demonstration of WatsonX matcher on a student with low GPA"""
    print("=" * 80)
    print("LOW GPA STUDENT MATCHING DEMO")
    print("=" * 80)
    
    # Load student data
    student_data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'exchange_program_dataset_updated.csv')
    university_requirements_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'university_requirements.csv')
    
    # Check if files exist
    if not os.path.exists(student_data_path):
        print(f"Error: Student data file not found at {student_data_path}")
        return
    
    if not os.path.exists(university_requirements_path):
        print(f"Error: University requirements file not found at {university_requirements_path}")
        return
    
    # Load student data
    students_df = pd.read_csv(student_data_path)
    
    # Convert GPA to numeric
    students_df['GPA'] = pd.to_numeric(students_df['GPA'], errors='coerce')
    
    # Find students with low GPA (below 2.6)
    low_gpa_students = students_df[students_df['GPA'] < 2.6].sort_values('GPA')
    
    if low_gpa_students.empty:
        print("No students with low GPA found.")
        return
    
    # Get the student with the lowest GPA
    student = low_gpa_students.iloc[0]
    
    print(f"\nSelected student with low GPA:")
    print(f"Name: {student['First Name']} {student['Last Name']}")
    print(f"GPA: {student['GPA']}")
    print(f"IELTS: {student['IELTS']}")
    print(f"Extra Co-Curriculars: {student['Extra Co-Curriculars']}")
    print(f"Credit Transfer Requirement: {student['Credit Transfer Requirement']}")
    
    # Initialize WatsonX matcher
    print("\nInitializing WatsonX matcher...")
    
    try:
        # Import config for API credentials
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        import config
        api_key = getattr(config, 'WATSON_API_KEY', None)
        project_id = getattr(config, 'WATSON_PROJECT_ID', None)
        
        if not api_key or not project_id:
            print("Error: API credentials not found in config.py")
            return
        
        matcher = WatsonXOfficialMatcher(
            student_data_path=student_data_path,
            university_requirements_path=university_requirements_path,
            api_key=api_key,
            project_id=project_id
        )
        
        # Create student profile - use the same field names as in the CSV
        student_profile = {
            "First Name": student['First Name'],
            "Last Name": student['Last Name'],
            "GPA": student['GPA'],
            "IELTS": student['IELTS'],
            "Extra Co-Curriculars": student['Extra Co-Curriculars'],
            "Credit Transfer Requirement": student['Credit Transfer Requirement']
        }
        
        # Get university rankings
        print("\nGenerating university rankings for student with low GPA...")
        # Create top 10 universities list (use all universities from the requirements file)
        student_profile['Top 10'] = ', '.join(matcher.universities_df['University Name'].tolist())
        
        # Use evaluate_new_student method to get rankings
        rankings = matcher.evaluate_new_student(student_profile)
        
        # Format the rankings for display
        university_rankings = [(r['university'], r['rank'], r['explanation']) for r in rankings]
        
        # Display rankings
        print("\nUniversity Rankings for Low GPA Student:")
        print("-" * 80)
        
        for i, (university, score, explanation) in enumerate(university_rankings, 1):
            print(f"\n{i}. {university}: {score}/10")
            print(f"   {explanation}")
        
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETED")
    print("=" * 80)

if __name__ == "__main__":
    run_low_gpa_demo()
