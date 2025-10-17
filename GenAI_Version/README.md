# GenAI University Exchange Program Matcher

An advanced version of the University Exchange Program Matcher that uses IBM WatsonX for generating personalized university rankings and detailed explanations.

## Overview

This system enhances the traditional matching algorithm with IBM WatsonX's natural language processing capabilities to provide more nuanced and personalized evaluations of student-university compatibility.

## Features

- **IBM WatsonX Integration**: Uses IBM's advanced language model for analysis
- **Personalized Rankings**: Generates a 0-10 ranking for each university in a student's top 10 list
- **Natural Language Explanations**: Provides detailed, human-like explanations for each ranking
- **Adaptive Analysis**: Considers complex relationships between student profiles and university requirements
- **Fallback Mechanism**: Uses traditional algorithm if Watson API is unavailable

## Setup

### Prerequisites

- Python 3.6+
- pandas
- numpy
- requests
- fuzzywuzzy

### IBM Watson API Key

To use the IBM Watson capabilities, you need to:

1. Get an API key from IBM Cloud
2. Set it as an environment variable:

```bash
export WATSON_API_KEY='your_api_key'
```

Optionally, you can also set a custom API URL:

```bash
export WATSON_API_URL='https://your-custom-endpoint.com/v1'
```

## Usage

### Running the Demo

```bash
python genai_demo.py
```

## How It Works

1. The system prepares a detailed prompt for IBM WatsonX that includes:
   - Student information (GPA, IELTS, extracurriculars, courses)
   - University requirements

2. WatsonX analyzes the match and returns:
   - A numerical score (0-10)
   - A detailed explanation of the match quality

3. If the Watson API is unavailable, the system falls back to a traditional algorithm

## Advantages Over Traditional Matching

- **Contextual Understanding**: Understands nuances in student profiles and university requirements
- **Natural Language Explanations**: Provides more detailed and personalized explanations
- **Holistic Analysis**: Considers factors beyond simple numerical comparisons
- **Adaptive Evaluation**: Can adjust its analysis based on different university contexts

## Future Enhancements

- Fine-tuning the Watson model for better matching accuracy
- Adding sentiment analysis of student extracurricular descriptions
- Implementing course similarity analysis using embeddings
- Creating a web interface for easier access
