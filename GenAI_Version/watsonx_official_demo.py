#!/usr/bin/env python3
"""
Demo script for the Official WatsonX University Matcher
"""
from watsonx_official_matcher import WatsonXOfficialMatcher
import os
import getpass

def run_demo():
    print("=" * 80)
    print("OFFICIAL WATSONX UNIVERSITY MATCHER DEMO")
    print("=" * 80)
    api_key = os.environ.get("WATSON_API_KEY")
    if not api_key:
        try:
            import config
            api_key = getattr(config, 'WATSON_API_KEY', None)
        except ImportError:
            pass
    
    if not api_key:
        print("\nNo API key found in environment variables or config file.")
        print("Would you like to enter your API key now? (y/n)")
        response = input()
        if response.lower() == 'y':
            api_key = getpass.getpass("Enter your IBM WatsonX API key: ")

    project_id = os.environ.get("WATSON_PROJECT_ID")
    if not project_id:
        try:
            import config
            project_id = getattr(config, 'WATSON_PROJECT_ID', None)
        except ImportError:
            pass
    
    if not project_id:
        print("\nNo project ID found in environment variables or config file.")
        print("Would you like to enter your project ID now? (y/n)")
        response = input()
        if response.lower() == 'y':
            project_id = input("Enter your IBM WatsonX project ID: ")
    
    # Initialize the matcher
    print("\nInitializing Official WatsonX matcher...")
    matcher = WatsonXOfficialMatcher(
        student_data_path='../exchange_program_dataset_updated.csv',
        university_requirements_path='../university_requirements.csv',
        api_key=api_key,
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
    print("\nGenerating university rankings using Official WatsonX API...")
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
    print("\nTo use IBM WatsonX capabilities:")
    print("1. Create an IBM Cloud account at https://cloud.ibm.com/")
    print("2. Set up a WatsonX.ai service and get an API key")
    print("3. Note your project ID from the Developer Access page")
    print("4. Set environment variables or update config.py with your credentials")

if __name__ == "__main__":
    run_demo()
