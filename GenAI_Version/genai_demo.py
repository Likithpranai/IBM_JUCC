#!/usr/bin/env python3
"""
Demo script for the GenAI-enhanced University Exchange Program Matcher
"""
from genai_university_matcher import GenAIUniversityMatcher
import os

# Try to import config file for API keys
try:
    import config
    has_config = True
except ImportError:
    has_config = False

def run_demo():
    """Run a demonstration of the GenAI university matcher with a sample student"""
    print("=" * 80)
    print("GENAI UNIVERSITY EXCHANGE PROGRAM MATCHER DEMO")
    print("=" * 80)
    
    # Check for API key from environment variables or config file
    api_key = os.environ.get("WATSON_API_KEY")
    
    # If not in environment variables, try config file
    if not api_key and has_config and hasattr(config, 'WATSON_API_KEY'):
        api_key = config.WATSON_API_KEY
        print("Using API key from config file")
    
    if not api_key:
        print("\nWARNING: No Watson API key found in environment variables or config file.")
        print("Set the WATSON_API_KEY environment variable or update the config.py file.")
        print("Falling back to traditional scoring algorithm.\n")
    
    # Initialize the matcher
    print("Initializing GenAI matcher...")
    
    # Get project ID if available
    project_id = None
    if has_config and hasattr(config, 'WATSON_PROJECT_ID'):
        project_id = config.WATSON_PROJECT_ID
    
    # Get API URL if available
    api_url = None
    if has_config and hasattr(config, 'WATSON_API_URL'):
        api_url = config.WATSON_API_URL
    
    matcher = GenAIUniversityMatcher(
        student_data_path='../exchange_program_dataset_updated.csv',
        university_requirements_path='../university_requirements.csv',
        api_key=api_key,
        api_url=api_url,
        project_id=project_id
    )
    
    # Sample student data
    sample_student = {
        'First Name': 'Emma',
        'Last Name': 'Watson',
        'Sex': 'Female',
        'Email': 'emma.watson@example.com',
        'GPA': '3.8',
        'IELTS': '8.5',
        'Top 10': 'University of Cambridge, University of Oxford, Imperial College London, University of Edinburgh, University of Manchester, Stanford, MIT, University of Tokyo, National University of Singapore, University of Sydney',
        'Consent': 'Yes',
        'Extra Co-Curriculars': 'Drama Club -> (Lead Actor), Debate Team -> (Captain), Volunteer Work -> (250 hours)',
        'Credit Transfer Requirement': 'MATH 14100, PHYS 9010, CHEM 10100, BIOL 9010, ISOM 17700'
    }
    
    print("\nSample Student Profile:")
    print(f"Name: {sample_student['First Name']} {sample_student['Last Name']}")
    print(f"GPA: {sample_student['GPA']}")
    print(f"IELTS: {sample_student['IELTS']}")
    print(f"Extracurriculars: {sample_student['Extra Co-Curriculars']}")
    print(f"Credit Transfer Courses: {sample_student['Credit Transfer Requirement']}")
    print(f"Universities of Interest: {sample_student['Top 10']}")
    
    # Generate rankings
    print("\nGenerating university rankings using GenAI...")
    rankings = matcher.evaluate_new_student(sample_student)
    
    # Display rankings
    print("\nRESULTS:")
    print("-" * 80)
    
    for i, ranking in enumerate(rankings):
        print(f"\n{i+1}. {ranking['university']}: {ranking['rank']}/10")
        print(f"   {ranking['explanation']}")
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETED")
    print("=" * 80)
    print("\nTo use IBM Watson capabilities:")
    print("1. Get an API key from IBM Cloud")
    print("2. Set environment variable: export WATSON_API_KEY='your_api_key'")
    print("3. Optionally set WATSON_API_URL if using a custom endpoint")

if __name__ == "__main__":
    run_demo()
