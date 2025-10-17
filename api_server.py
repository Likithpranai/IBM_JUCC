#!/usr/bin/env python3
"""
API Server for Student Exchange Platform
Connects the React frontend to the IBM WatsonX backend
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'GenAI_Version'))

# Import the WatsonX SDK Matcher with fallback
try:
    from watsonx_sdk_matcher import WatsonXSDKMatcher
    WATSONX_SDK_AVAILABLE = True
except ImportError:
    print("WatsonX SDK Matcher not available. Using simulated results.")
    WATSONX_SDK_AVAILABLE = False
    WatsonXSDKMatcher = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the WatsonX matcher if available
if WATSONX_SDK_AVAILABLE:
    try:
        matcher = WatsonXSDKMatcher(
            student_data_path='exchange_program_dataset.csv',
            university_requirements_path='university_requirements.csv'
        )
    except Exception as e:
        print(f"Error initializing WatsonX SDK Matcher: {e}")
        matcher = None
else:
    matcher = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'API server is running',
        'watsonx_available': matcher is not None and getattr(matcher, 'model', None) is not None
    })

@app.route('/api/universities', methods=['GET'])
def get_universities():
    """Get all available universities"""
    if matcher is None:
        # Return some default universities if matcher is not available
        universities = [
            "Massachusetts Institute of Technology (MIT)",
            "Stanford University",
            "University of Oxford",
            "University of Cambridge",
            "ETH Zurich",
            "Imperial College London",
            "University of Tokyo",
            "National University of Singapore"
        ]
    else:
        universities = matcher.universities_df['University Name'].tolist()
    
    return jsonify({
        'universities': universities
    })

@app.route('/api/match', methods=['POST'])
def match_universities():
    """
    Match student preferences with universities
    
    Expected JSON payload:
    {
        "student": {
            "First Name": "John",
            "Last Name": "Doe",
            "GPA": "3.8",
            "IELTS": "7.5",
            "Extra Co-Curriculars": "Robotics Club -> (President), Volunteer Teaching -> (Tutor), Hackathon -> (Participant)",
            "Credit Transfer Requirement": "MATH 14100, PHYS 9010, CHEM 10100, BIOL 9010, ISOM 17700",
            "Top 10": "University of Cambridge, University of Oxford, MIT, Stanford, ETH Zurich"
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'student' not in data:
            return jsonify({
                'error': 'Invalid request format',
                'message': 'Request must include student data'
            }), 400
        
        student_data = data['student']
        
        # Validate required fields
        required_fields = ['First Name', 'Last Name', 'GPA', 'IELTS', 'Top 10']
        for field in required_fields:
            if field not in student_data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'message': f'Student data must include {field}'
                }), 400
        
        # Set default values for optional fields
        if 'Extra Co-Curriculars' not in student_data:
            student_data['Extra Co-Curriculars'] = ''
        
        if 'Credit Transfer Requirement' not in student_data:
            student_data['Credit Transfer Requirement'] = ''
        
        if matcher is not None:
            # Generate rankings using WatsonX
            try:
                rankings = matcher.evaluate_new_student(student_data)
                
                # Format the response
                formatted_rankings = []
                for rank in rankings:
                    # Get university details from the database
                    uni_data = matcher.universities_df[matcher.universities_df['University Name'] == rank['university']]
                    
                    uni_details = {}
                    if not uni_data.empty:
                        uni_row = uni_data.iloc[0]
                        uni_details = {
                            'minGPA': float(uni_row['Min GPA']),
                            'minIELTS': float(uni_row['Min IELTS']),
                            'requiredExtracurriculars': int(uni_row['Required Extracurriculars']),
                            'additionalRequirements': uni_row['Additional Requirements']
                        }
                    
                    formatted_rankings.append({
                        'university': rank['university'],
                        'score': rank['rank'],
                        'explanation': rank['explanation'],
                        'details': uni_details
                    })
                
                return jsonify({
                    'rankings': formatted_rankings
                })
            except Exception as e:
                print(f"Error using WatsonX matcher: {e}")
                # Fall through to simulated results
        
        # If matcher is not available or failed, generate simulated results
        print("Using simulated results")
        universities = student_data['Top 10'].split(', ')
        student_gpa = float(student_data['GPA'])
        student_ielts = float(student_data['IELTS'])
        
        formatted_rankings = []
        for uni in universities:
            # Generate a simulated score based on GPA and IELTS
            base_score = 7 + (student_gpa - 3.0) + (student_ielts - 6.5) / 2
            score = min(10, max(1, base_score))
            rounded_score = round(score)
            
            # Generate a simulated explanation
            if score >= 8:
                explanation = f"Excellent match for {uni}! Your GPA of {student_gpa} and IELTS score of {student_ielts} exceed the university's requirements."
            elif score >= 6:
                explanation = f"Good match for {uni}. Your academic profile meets most of the university's requirements."
            else:
                explanation = f"This university may be challenging to get into with your current profile. Consider improving your GPA and language scores."
            
            formatted_rankings.append({
                'university': uni,
                'score': rounded_score,
                'explanation': explanation,
                'details': {
                    'minGPA': 3.5,
                    'minIELTS': 6.5,
                    'requiredExtracurriculars': 2,
                    'additionalRequirements': 'No additional requirements'
                }
            })
        
        # Sort by score
        formatted_rankings.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'rankings': formatted_rankings,
            'simulated': True
        })
    
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Student Exchange Platform API Server...")
    print(f"WatsonX model available: {matcher.model is not None}")
    app.run(host='0.0.0.0', port=5001, debug=True)
