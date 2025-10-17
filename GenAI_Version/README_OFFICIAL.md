# Official IBM WatsonX University Exchange Program Matcher

This version of the University Exchange Program Matcher uses the official IBM WatsonX API client following the exact pattern from the IBM documentation.

## Overview

The Official WatsonX Matcher enhances the university matching system by using IBM's official Python SDK to connect with WatsonX.ai services. This implementation follows the exact pattern shown in the IBM WatsonX documentation.

## Setup

### Prerequisites

1. Install the required packages:
   ```bash
   pip install ibm-watsonx-ai pandas numpy fuzzywuzzy
   ```

2. Set up your IBM Cloud account:
   - Create an account at [IBM Cloud](https://cloud.ibm.com/)
   - Set up a WatsonX.ai service
   - Create an API key from the IBM Cloud dashboard
   - Note your project ID from the Developer Access page

3. Configure credentials:
   - Option 1: Set environment variables:
     ```bash
     export WATSON_API_KEY="your_api_key"
     export WATSON_PROJECT_ID="your_project_id"
     ```
   - Option 2: Update the config.py file with your credentials
   - Option 3: Enter credentials when prompted by the demo script

## Usage

### Running the Demo

```bash
python watsonx_official_demo.py
```

### Using the Matcher in Your Code

```python
from watsonx_official_matcher import WatsonXOfficialMatcher

# Initialize the matcher
matcher = WatsonXOfficialMatcher(
    student_data_path='path/to/students.csv',
    university_requirements_path='path/to/universities.csv',
    project_id='your_project_id',
    api_key='your_api_key'
)

# Evaluate a student
student_data = {
    'First Name': 'Emma',
    'Last Name': 'Watson',
    'GPA': '3.8',
    'IELTS': '8.5',
    'Top 10': 'University A, University B, University C',
    'Extra Co-Curriculars': 'Activity 1, Activity 2',
    'Credit Transfer Requirement': 'Course 1, Course 2'
}

rankings = matcher.evaluate_new_student(student_data)
```

## How It Works

1. The system initializes the WatsonX API client with your credentials
2. For each university in the student's top 10 list:
   - A prompt is created with the student and university information
   - The prompt is sent to the WatsonX model (granite-13b-instruct-v2)
   - The response is parsed to extract a score and explanation
   - If the WatsonX API is unavailable, it falls back to the traditional algorithm

3. The results are sorted and returned as a ranked list with explanations

## Advantages of the Official API Client

- **Direct from IBM**: Uses the approach directly from IBM's documentation
- **Simplified Authentication**: Cleaner authentication flow
- **Better Error Handling**: Improved error handling and fallback mechanisms
- **Future Compatibility**: Better positioned for future WatsonX updates

## Troubleshooting

- **ImportError**: Make sure you've installed the required packages
- **Authentication Error**: Verify your API key and project ID
- **Model Not Found**: Ensure you have access to the specified model in your IBM Cloud account
- **Fallback to Traditional**: If you see this message, check your IBM Cloud credentials and network connectivity

## References

- [IBM WatsonX Documentation](https://cloud.ibm.com/docs/watsonx-as-a-service)
- [IBM WatsonX API Client](https://github.com/IBM/watsonx-ai-python-sdk)
- [IBM Foundation Models](https://www.ibm.com/products/watsonx-ai)
