import pandas as pd
from university_matcher import UniversityMatcher
import json

def get_student_input():
    """Get student information from user input"""
    print("Welcome to the University Exchange Program Matcher")
    print("Please enter your information to get personalized university rankings\n")
    
    student = {}
    
    student['First Name'] = input("First Name: ")
    student['Last Name'] = input("Last Name: ")
    student['Sex'] = input("Sex (Male/Female): ")
    student['Email'] = input("Email: ")
    
    # GPA validation
    while True:
        try:
            gpa = float(input("GPA (2.0-4.3): "))
            if 0 <= gpa <= 4.3:
                student['GPA'] = str(gpa)
                break
            else:
                print("GPA must be between 0 and 4.3")
        except ValueError:
            print("Please enter a valid number")
    
    # IELTS validation
    while True:
        try:
            ielts = float(input("IELTS Score (6.0-9.0): "))
            if 6.0 <= ielts <= 9.0:
                student['IELTS'] = str(ielts)
                break
            else:
                print("IELTS must be between 6.0 and 9.0")
        except ValueError:
            print("Please enter a valid number")
    
    print("\nEnter your top university choices (comma-separated):")
    print("Available universities:")
    
    # Load universities from the CSV file
    universities_df = pd.read_csv('university_requirements.csv')
    for i, uni in enumerate(universities_df['University Name']):
        print(f"{i+1}. {uni}")
    
    top_10 = input("\nYour choices (comma-separated): ")
    student['Top 10'] = top_10
    
    student['Consent'] = 'Yes'  # Assuming consent is given
    
    print("\nEnter your extracurricular activities (format: Activity -> (Description))")
    print("Example: Debate Team -> (Member), Volunteer Work -> (200 hours)")
    extracurriculars = input("Extracurriculars: ")
    student['Extra Co-Curriculars'] = extracurriculars
    
    print("\nEnter your courses for credit transfer (comma-separated course codes)")
    print("Example: MATH 14100, PHYS 9010, CHEM 10100")
    credit_transfer = input("Credit Transfer Courses: ")
    student['Credit Transfer Requirement'] = credit_transfer
    
    return student

def display_rankings(rankings):
    """Display university rankings in a user-friendly format"""
    print("\n===== YOUR UNIVERSITY RANKINGS =====\n")
    
    for i, ranking in enumerate(rankings):
        print(f"#{i+1}: {ranking['university']} - {ranking['rank']}/10")
        print(f"Assessment: {ranking['explanation']}")
        print("-" * 50)

def main():
    """Main function for the interactive university matcher"""
    try:
        # Initialize the matcher
        matcher = UniversityMatcher(
            student_data_path='exchange_program_dataset_updated.csv',
            university_requirements_path='university_requirements.csv'
        )
        
        # Get student input
        student = get_student_input()
        
        # Generate rankings
        rankings = matcher.evaluate_new_student(student)
        
        # Display rankings
        display_rankings(rankings)
        
        # Optionally save results
        save = input("\nWould you like to save your results? (y/n): ")
        if save.lower() == 'y':
            filename = f"{student['First Name']}_{student['Last Name']}_rankings.json"
            with open(filename, 'w') as f:
                json.dump(rankings, f, indent=4)
            print(f"Results saved to {filename}")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
