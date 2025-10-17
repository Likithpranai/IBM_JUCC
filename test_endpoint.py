#!/usr/bin/env python3
"""
Test script for the WatsonX API endpoint
"""
import sys
import json
import os

# Add the GenAI_Version directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'GenAI_Version'))

# Import the function directly
from watsonx_api_endpoint import generate_simulated_rankings

# Test data
student_data = {
    'First Name': 'Test',
    'Last Name': 'User',
    'GPA': '3.8',
    'IELTS': '8.0',
    'Top 10': 'Berkeley, MIT, Stanford'
}

# Generate rankings
rankings = generate_simulated_rankings(student_data)

# Print results
print(json.dumps(rankings, indent=2))
