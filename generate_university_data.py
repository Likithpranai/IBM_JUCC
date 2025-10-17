#!/usr/bin/env python3
"""
Generate synthetic university requirements data for all universities in the frontend
"""
import csv
import random
import os

# List of universities from the frontend
UNIVERSITIES = [
    'Massachusetts Institute of Technology (MIT)',
    'Stanford University',
    'University of Oxford',
    'University of Cambridge',
    'ETH Zurich',
    'Imperial College London',
    'University of Tokyo',
    'National University of Singapore',
    'University of California, Berkeley',
    'Harvard University',
    'University of Toronto',
    'University of British Columbia',
    'University of Melbourne',
    'University of Sydney',
    'University of Hong Kong'
]

# Engineering courses
ENGINEERING_COURSES = [
    'ENGR 1010', 'ENGR 2020', 'ENGR 3030', 'ENGR 4040', 'ENGR 5050',
    'MECH 1100', 'MECH 2200', 'MECH 3300', 'MECH 4400', 'MECH 5500',
    'ELEC 1110', 'ELEC 2220', 'ELEC 3330', 'ELEC 4440', 'ELEC 5550',
    'CHEM 1120', 'CHEM 2230', 'CHEM 3340', 'CHEM 4450', 'CHEM 5560'
]

# Science courses
SCIENCE_COURSES = [
    'PHYS 1010', 'PHYS 2020', 'PHYS 3030', 'PHYS 4040', 'PHYS 5050',
    'BIOL 1100', 'BIOL 2200', 'BIOL 3300', 'BIOL 4400', 'BIOL 5500',
    'CHEM 1110', 'CHEM 2210', 'CHEM 3310', 'CHEM 4410', 'CHEM 5510',
    'MATH 1120', 'MATH 2220', 'MATH 3320', 'MATH 4420', 'MATH 5520'
]

# Business courses
BUSINESS_COURSES = [
    'BUSI 1010', 'BUSI 2020', 'BUSI 3030', 'BUSI 4040', 'BUSI 5050',
    'ACCT 1100', 'ACCT 2200', 'ACCT 3300', 'ACCT 4400', 'ACCT 5500',
    'FINA 1110', 'FINA 2210', 'FINA 3310', 'FINA 4410', 'FINA 5510',
    'MKTG 1120', 'MKTG 2220', 'MKTG 3320', 'MKTG 4420', 'MKTG 5520'
]

# Additional requirements
ADDITIONAL_REQUIREMENTS = [
    'Letter of recommendation from a professor',
    'Statement of purpose',
    'Portfolio submission',
    'Interview required',
    'Research proposal',
    'Language proficiency certificate',
    'Work experience preferred',
    'Leadership experience',
    'Community service',
    'Specific course prerequisites',
    'Minimum credit hours completed',
    'Academic writing sample',
    'Standardized test scores',
    'Departmental approval',
    'Prior research experience'
]

def generate_university_data():
    """Generate synthetic university requirements data"""
    data = []
    
    for i, university in enumerate(UNIVERSITIES):
        # Generate realistic GPA requirements based on university ranking
        ranking_factor = 1 - (i / len(UNIVERSITIES))  # Higher ranked universities have higher requirements
        min_gpa = round(3.0 + (ranking_factor * 1.0), 1)  # GPA between 3.0 and 4.0
        min_ielts = round(6.0 + (ranking_factor * 1.5), 1)  # IELTS between 6.0 and 7.5
        
        # Generate required extracurriculars
        required_extracurriculars = random.randint(1, 5)
        
        # Generate credit transfer courses
        eng_courses = random.sample(ENGINEERING_COURSES, random.randint(3, 8))
        sci_courses = random.sample(SCIENCE_COURSES, random.randint(3, 8))
        bus_courses = random.sample(BUSINESS_COURSES, random.randint(3, 8))
        
        # Generate additional requirements
        additional_reqs = random.sample(ADDITIONAL_REQUIREMENTS, random.randint(1, 3))
        
        # Create university data entry
        university_data = {
            'University Name': university,
            'Min GPA': min_gpa,
            'Min IELTS': min_ielts,
            'Required Extracurriculars': required_extracurriculars,
            'Engineering Credit Transfer': ', '.join(eng_courses),
            'Science Credit Transfer': ', '.join(sci_courses),
            'Business Credit Transfer': ', '.join(bus_courses),
            'Additional Requirements': '. '.join(additional_reqs)
        }
        
        data.append(university_data)
    
    return data

def save_to_csv(data, output_path):
    """Save university data to CSV file"""
    fieldnames = [
        'University Name', 'Min GPA', 'Min IELTS', 'Required Extracurriculars',
        'Engineering Credit Transfer', 'Science Credit Transfer', 'Business Credit Transfer',
        'Additional Requirements'
    ]
    
    with open(output_path, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    
    print(f"University requirements data saved to {output_path}")

if __name__ == "__main__":
    # Generate university data
    university_data = generate_university_data()
    
    # Save to CSV
    output_path = os.path.join(os.path.dirname(__file__), 'university_requirements.csv')
    save_to_csv(university_data, output_path)
    
    # Print sample data
    print("\nSample university requirements:")
    for i, uni in enumerate(university_data[:3]):
        print(f"\n{i+1}. {uni['University Name']}")
        print(f"   Min GPA: {uni['Min GPA']}")
        print(f"   Min IELTS: {uni['Min IELTS']}")
        print(f"   Required Extracurriculars: {uni['Required Extracurriculars']}")
        print(f"   Engineering Credits: {uni['Engineering Credit Transfer'][:50]}...")
