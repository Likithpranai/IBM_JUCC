
import pandas as pd
import random
import csv

def generate_mock_university_requirements():
    print("Generating mock university requirements...")
    try:
        students_df = pd.read_csv('exchange_program_dataset_updated.csv')
    except FileNotFoundError:
        print("Error: exchange_program_dataset_updated.csv not found")
        return
    try:
        existing_requirements = pd.read_csv('university_requirements.csv')
        existing_universities = existing_requirements['University Name'].tolist()
        print(f"Found {len(existing_universities)} existing university requirements")
    except FileNotFoundError:
        existing_universities = []
        print("No existing university requirements found, creating new file")
  
    all_universities = set()
    for top_10 in students_df['Top 10']:
        if isinstance(top_10, str):
            universities = top_10.split(', ')
            all_universities.update(universities)
    
    # Filter out universities that already have requirements
    new_universities = [uni for uni in all_universities if uni not in existing_universities]
    print(f"Found {len(new_universities)} new universities to add")
    new_requirements = []
    for uni in new_universities:
        # Generate random requirements
        min_gpa = round(random.uniform(2.8, 3.8), 1)
        min_ielts = round(random.uniform(6.0, 8.0), 1)
        required_extracurriculars = random.randint(1, 3)
      
        engineering_courses = ", ".join([
            f"MATH {random.randint(10, 30)}100", 
            f"PHYS {random.randint(10, 30)}010", 
            f"ISOM {random.randint(15, 35)}700"
        ])
        
        science_courses = ", ".join([
            f"BIOL {random.randint(10, 30)}010", 
            f"CHEM {random.randint(10, 30)}100", 
            f"PHYS {random.randint(10, 30)}010"
        ])
        
        business_courses = ", ".join([
            f"ECON {random.randint(10, 30)}010", 
            f"MGMT {random.randint(10, 30)}100", 
            f"ISOM {random.randint(15, 35)}700"
        ])
        
        # Generate random additional requirements
        additional_requirements = random.choice([
            "Strong research background preferred",
            "Interview required",
            "Leadership experience valued",
            "Community service recommended",
            "Work experience preferred",
            "Language proficiency beneficial",
            "Portfolio submission required for certain programs",
            "Strong academic references needed"
        ])
        
        # Add to new requirements
        new_requirements.append({
            "University Name": uni,
            "Min GPA": min_gpa,
            "Min IELTS": min_ielts,
            "Required Extracurriculars": required_extracurriculars,
            "Engineering Credit Transfer": engineering_courses,
            "Science Credit Transfer": science_courses,
            "Business Credit Transfer": business_courses,
            "Additional Requirements": additional_requirements
        })
  
    if new_requirements:
        if existing_universities:
            with open('university_requirements.csv', 'a', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=new_requirements[0].keys())
                writer.writerows(new_requirements)
            print(f"Added {len(new_requirements)} new university requirements to existing file")
        else:
            # Create new file
            pd.DataFrame(new_requirements).to_csv('university_requirements.csv', index=False)
            print(f"Created new university requirements file with {len(new_requirements)} universities")
    else:
        print("No new universities to add")

if __name__ == "__main__":
    generate_mock_university_requirements()
