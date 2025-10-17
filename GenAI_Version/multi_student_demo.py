#!/usr/bin/env python3
"""
Demo script for the Official WatsonX University Matcher with multiple students
"""
from watsonx_official_matcher import WatsonXOfficialMatcher
import os
import pandas as pd
import getpass

def run_multi_student_demo():
    """Run a demonstration of the Official WatsonX university matcher with multiple students"""
    print("=" * 80)
    print("MULTI-STUDENT WATSONX UNIVERSITY MATCHER DEMO")
    print("=" * 80)
    
    # Initialize the matcher
    print("\nInitializing Official WatsonX matcher...")
    matcher = WatsonXOfficialMatcher(
        student_data_path='../exchange_program_dataset_updated.csv',
        university_requirements_path='../university_requirements.csv'
    )
    
    # Load the student data
    students_df = pd.read_csv('../exchange_program_dataset_updated.csv')
    
    # Select students with different GPAs
    # Keith Kshlerin - GPA 4.0
    # Irvin Mertz - GPA 3.2 (closest to 3.1)
    # Annie Koelpin - GPA 2.8 (closest to 2.7)
    student_names = ["Keith Kshlerin", "Irvin Mertz", "Annie Koelpin"]
    
    # Process each student
    for name in student_names:
        first_name, last_name = name.split()
        student_row = students_df[(students_df['First Name'] == first_name) & 
                                 (students_df['Last Name'] == last_name)]
        
        if len(student_row) == 0:
            print(f"Student {name} not found in dataset. Skipping.")
            continue
            
        student_data = student_row.iloc[0].to_dict()
        
        print("\n" + "=" * 80)
        print(f"STUDENT PROFILE: {name} (GPA: {student_data['GPA']})")
        print("=" * 80)
        
        print(f"Name: {student_data['First Name']} {student_data['Last Name']}")
        print(f"GPA: {student_data['GPA']}")
        print(f"IELTS: {student_data['IELTS']}")
        print(f"Extracurriculars: {student_data['Extra Co-Curriculars']}")
        print(f"Credit Transfer Courses: {student_data['Credit Transfer Requirement']}")
        print(f"Universities of Interest: {student_data['Top 10']}")
        
        # Generate rankings
        print("\nGenerating university rankings using Official WatsonX API...")
        rankings = matcher.evaluate_new_student(student_data)
        
        # Display rankings
        print("\nRESULTS:")
        print("-" * 80)
        
        for i, ranking in enumerate(rankings):
            print(f"\n{i+1}. {ranking['university']}: {ranking['rank']}/10")
            print(f"   {ranking['explanation']}")
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETED")
    print("=" * 80)

if __name__ == "__main__":
    run_multi_student_demo()
