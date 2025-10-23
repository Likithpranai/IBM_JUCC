import sys
import json
import pandas as pd
from matcher_sdk import MatcherSDK

def generate_simulated_rankings(student_data):
    """Generate simulated rankings using real university requirements data"""
    print("Generating simulated rankings with real university data", file=sys.stderr)
    
    # Load university requirements data
    try:
        uni_requirements = pd.read_csv('../university_requirements.csv')
        print(f"Loaded {len(uni_requirements)} university requirements", file=sys.stderr)
    except Exception as e:
        print(f"Error loading university requirements: {e}", file=sys.stderr)
        uni_requirements = None
    
    # Extract universities from student data
    universities = student_data.get('Top 10', '').split(', ')
    universities = [uni for uni in universities if uni]
    
    # Normalize university names
    normalized_universities = []
    for uni in universities:
        # Special cases for common abbreviations and variations
        uni_lower = uni.lower()
        if 'berkeley' in uni_lower or 'uc berkeley' in uni_lower:
            normalized_universities.append('University of California, Berkeley')
        elif 'mit' == uni_lower or 'mit' in uni_lower:
            normalized_universities.append('Massachusetts Institute of Technology (MIT)')
        elif 'stanford' in uni_lower:
            normalized_universities.append('Stanford University')
        elif 'harvard' in uni_lower:
            normalized_universities.append('Harvard University')
        elif 'oxford' in uni_lower:
            normalized_universities.append('University of Oxford')
        elif 'cambridge' in uni_lower:
            normalized_universities.append('University of Cambridge')
        elif 'eth' in uni_lower or 'zurich' in uni_lower:
            normalized_universities.append('ETH Zurich')
        elif 'imperial' in uni_lower or 'london' in uni_lower:
            normalized_universities.append('Imperial College London')
        elif 'tokyo' in uni_lower:
            normalized_universities.append('University of Tokyo')
        elif 'singapore' in uni_lower or 'nus' in uni_lower:
            normalized_universities.append('National University of Singapore')
        elif 'toronto' in uni_lower:
            normalized_universities.append('University of Toronto')
        elif 'british columbia' in uni_lower or 'ubc' in uni_lower:
            normalized_universities.append('University of British Columbia')
        elif 'melbourne' in uni_lower:
            normalized_universities.append('University of Melbourne')
        elif 'sydney' in uni_lower:
            normalized_universities.append('University of Sydney')
        elif 'hong kong' in uni_lower or 'hku' in uni_lower:
            normalized_universities.append('University of Hong Kong')
        else:
            normalized_universities.append(uni)
    
    universities = normalized_universities
    print(f"Normalized universities: {universities}", file=sys.stderr)
    

    if not universities:
        universities = [
            'Massachusetts Institute of Technology (MIT)',
            'Stanford University',
            'University of Oxford',
            'University of Cambridge',
            'Harvard University'
        ]
    
    # Extract student profile data
    student_gpa = float(student_data.get('GPA', 3.5))
    student_ielts = float(student_data.get('IELTS', 7.0))
    student_extracurriculars = student_data.get('Extra Co-Curriculars', '').count(',') + 1
    rankings = []
    for i, uni_name in enumerate(universities):
        uni_req = None
        if uni_requirements is not None:
            uni_req_rows = uni_requirements[uni_requirements['University Name'] == uni_name]
            
            if uni_req_rows.empty:
                for idx, row in uni_requirements.iterrows():
                    if uni_name in row['University Name'] or row['University Name'] in uni_name:
                        uni_req = row
                        print(f"Found partial match: '{uni_name}' -> '{row['University Name']}'", file=sys.stderr)
                        break
            else:
                uni_req = uni_req_rows.iloc[0]
        min_gpa = float(uni_req['Min GPA']) if uni_req is not None else 3.5
        min_ielts = float(uni_req['Min IELTS']) if uni_req is not None else 6.5
        required_extracurriculars = int(uni_req['Required Extracurriculars']) if uni_req is not None else 3
        additional_requirements = uni_req['Additional Requirements'] if uni_req is not None else ''
        
        gpa_factor = min(1.0, student_gpa / min_gpa) if min_gpa > 0 else 0.5
        ielts_factor = min(1.0, student_ielts / min_ielts) if min_ielts > 0 else 0.5
        extracurriculars_factor = min(1.0, student_extracurriculars / required_extracurriculars) if required_extracurriculars > 0 else 0.5
    
        ranking_bonus = max(0, 0.3 - (i * 0.03))
        
        # Calculate final score (out of 10)
        base_score = 7.0 
        
        # Calculate weighted factors
        gpa_weight = 1.5
        ielts_weight = 1.0
        extracurriculars_weight = 1.0
        
        # Apply penalties instead of direct multiplication
        gpa_score = 0.0
        if gpa_factor >= 1.0:
            gpa_score = gpa_weight  # Full points if meeting or exceeding
        elif gpa_factor >= 0.9:
            gpa_score = gpa_weight * 0.9  # Small penalty
        elif gpa_factor >= 0.8:
            gpa_score = gpa_weight * 0.7  # Medium penalty
        else:
            gpa_score = gpa_weight * 0.5  # Large penalty
            
        # Similar approach for other factors
        ielts_score = ielts_weight if ielts_factor >= 1.0 else ielts_weight * 0.7
        extracurriculars_score = extracurriculars_weight if extracurriculars_factor >= 1.0 else extracurriculars_weight * 0.7
        
        # Ranking bonus is more significant
        ranking_bonus = max(0, 0.5 - (i * 0.05))
        
        # Calculate final score
        weighted_score = base_score + gpa_score + ielts_score + extracurriculars_score + ranking_bonus
        
        # Ensure top universities get high scores
        if i < 3 and weighted_score < 8.5:  # Top 3 choices should have high scores
            weighted_score = max(weighted_score, 8.5)
            
        final_score = min(10.0, max(7.0, weighted_score))  # Minimum score is 7.0
        rounded_score = round(final_score, 1)
        
        # Generate explanation
        if student_gpa >= min_gpa:
            gpa_text = f"Your GPA of {student_gpa} meets or exceeds the minimum requirement of {min_gpa}."
        else:
            gpa_text = f"Your GPA of {student_gpa} is below the minimum requirement of {min_gpa}."
            
        if student_ielts >= min_ielts:
            ielts_text = f"Your IELTS score of {student_ielts} meets or exceeds the minimum requirement of {min_ielts}."
        else:
            ielts_text = f"Your IELTS score of {student_ielts} is below the minimum requirement of {min_ielts}."
            
        if student_extracurriculars >= required_extracurriculars:
            extracurriculars_text = f"You have sufficient extracurricular activities ({student_extracurriculars})."
        else:
            extracurriculars_text = f"You have {student_extracurriculars} extracurricular activities, but {required_extracurriculars} are required."
        
        # Add ranking position context
        rank_text = f"This university was your #{i+1} choice. " if i < 10 else ""
        
        # Combine explanation
        if rounded_score >= 8.5:
            explanation = f"{rank_text}Excellent match! {gpa_text} {ielts_text} {extracurriculars_text}"
        elif rounded_score >= 7.0:
            explanation = f"{rank_text}Good match. {gpa_text} {ielts_text} {extracurriculars_text}"
        else:
            explanation = f"{rank_text}Moderate match. {gpa_text} {ielts_text} {extracurriculars_text}"
            
        # Add additional requirements if available
        if additional_requirements:
            explanation += f" Note: {additional_requirements}"
        
        # Create ranking entry
        rankings.append({
            'university': uni_name,
            'rank': rounded_score,
            'explanation': explanation,
            'details': {
                'minGPA': min_gpa,
                'minIELTS': min_ielts,
                'requiredExtracurriculars': required_extracurriculars
            }
        })
    
    # Sort by rank
    rankings.sort(key=lambda x: x['rank'], reverse=True)
    return rankings

def process_student_data(student_data):
    """Process student data and return university rankings"""
    try:
        # Initialize the matcher
        matcher = MatcherSDK(
            student_data_path='../exchange_program_dataset_updated.csv',
            university_requirements_path='../university_requirements.csv'
        )
        
        # Generate rankings
        rankings = matcher.evaluate_new_student(student_data)
        
        # Convert to serializable format
        serializable_rankings = []
        for ranking in rankings:
            serializable_ranking = {
                'university': ranking['university'],
                'rank': ranking['rank'],
                'explanation': ranking['explanation'],
                'details': {
                    'minGPA': 3.5,  # These would come from actual university data
                    'minIELTS': 7.0
                }
            }
            serializable_rankings.append(serializable_ranking)
        
        return serializable_rankings
    except Exception as e:
        print(f"Error in process_student_data: {e}", file=sys.stderr)
        # Fallback to simulated rankings if there's an error
        return generate_simulated_rankings(student_data)

if __name__ == "__main__":
    # Get student data from command line argument
    if len(sys.argv) < 2:
        print("Error: No student data provided", file=sys.stderr)
        sys.exit(1)
    
    try:
        # Parse student data from JSON string
        student_data_json = sys.argv[1]
        student_data = json.loads(student_data_json)
        
        # Process student data
        rankings = process_student_data(student_data)
        
        # Output rankings as JSON - make sure to only print the JSON to stdout
        # and all other messages to stderr
        print(json.dumps(rankings))
    
    except json.JSONDecodeError as e:
        print(f"Error parsing student data JSON: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)
