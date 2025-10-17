#!/usr/bin/env python3
"""
Demo script for the WatsonX SDK University Matcher
"""
from watsonx_sdk_matcher import WatsonXSDKMatcher
import os

def run_demo():
    """Run a demonstration of the WatsonX SDK university matcher with a sample student"""
    print("=" * 80)
    print("WATSONX SDK UNIVERSITY MATCHER DEMO")
    print("=" * 80)
    
    # Initialize the matcher
    print("Initializing WatsonX SDK matcher...")
    matcher = WatsonXSDKMatcher(
        student_data_path='../exchange_program_dataset_updated.csv',
        university_requirements_path='../university_requirements.csv'
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
    print("\nGenerating university rankings using WatsonX SDK...")
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
    print("\nTo use IBM WatsonX SDK capabilities:")
    print("1. Install the required packages: pip install ibm-watsonx-ai ibm-watson-machine-learning")
    print("2. Set up your IBM Cloud account and get an API key")
    print("3. Set environment variables or update config.py with your credentials")

if __name__ == "__main__":
    run_demo()
