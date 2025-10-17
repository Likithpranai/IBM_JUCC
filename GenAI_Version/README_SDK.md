# WatsonX SDK University Exchange Program Matcher

This version of the University Exchange Program Matcher uses the official IBM WatsonX SDK for more reliable integration with IBM's AI services.

## Overview

The WatsonX SDK Matcher enhances the university matching system by using IBM's official Python SDK to connect with WatsonX.ai services. This approach provides more reliable authentication and better integration with IBM Cloud services.

## Setup

### Prerequisites

1. Install the required packages:
   ```bash
   pip install ibm-watsonx-ai ibm-watson-machine-learning pandas numpy fuzzywuzzy
   ```

2. Set up your IBM Cloud account:
   - Create an account at [IBM Cloud](https://cloud.ibm.com/)
   - Set up a WatsonX.ai service
   - Create an API key
   - Note your project ID

3. Configure credentials:
   - Option 1: Set environment variables:
     ```bash
     export WATSON_API_KEY="your_api_key"
     export WATSON_PROJECT_ID="your_project_id"
     ```
   - Option 2: Update the config.py file with your credentials

## Usage

### Running the Demo

```bash
python watsonx_sdk_demo.py
```

### Using the Matcher in Your Code

```python
from watsonx_sdk_matcher import WatsonXSDKMatcher

# Initialize the matcher
matcher = WatsonXSDKMatcher(
    student_data_path='path/to/students.csv',
    university_requirements_path='path/to/universities.csv',
    project_id='your_project_id',  # Optional, can use environment variable
    api_key='your_api_key'         # Optional, can use environment variable
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

1. The system initializes the WatsonX SDK with your project ID and API key
2. For each university in the student's top 10 list:
   - A prompt is created with the student and university information
   - The prompt is sent to the WatsonX model (granite-13b-instruct-v2)
   - The response is parsed to extract a score and explanation
   - If the WatsonX API is unavailable, it falls back to the traditional algorithm

3. The results are sorted and returned as a ranked list with explanations

## Advantages of the SDK Approach

- **Official Support**: Uses IBM's officially supported SDK
- **Better Authentication**: More reliable authentication flow
- **Error Handling**: Improved error handling and fallback mechanisms
- **Future Compatibility**: Better positioned for future WatsonX updates

## Troubleshooting

- **ImportError**: Make sure you've installed the required packages
- **Authentication Error**: Verify your API key and project ID
- **Model Not Found**: Ensure you have access to the specified model in your IBM Cloud account
- **Fallback to Traditional**: If you see this message, check your IBM Cloud credentials and network connectivity

## References

- [IBM WatsonX Documentation](https://cloud.ibm.com/docs/watsonx-as-a-service)
- [IBM Watson Machine Learning SDK](https://github.com/IBM/watson-machine-learning-samples)
- [IBM Foundation Models](https://www.ibm.com/products/watsonx-ai)
