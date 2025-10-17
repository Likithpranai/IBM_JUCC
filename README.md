# University Exchange Program Matcher

A comprehensive system for matching students with university exchange programs based on their academic profiles, extracurricular activities, and credit transfer requirements.

## Overview

This system evaluates student profiles against university requirements to generate personalized rankings and detailed explanations. It helps students identify the best-fit universities for their exchange programs by considering multiple factors:

- GPA compatibility
- IELTS scores
- Extracurricular activities
- Credit transfer potential
- Additional university-specific requirements

## Features

- **Personalized Rankings**: Generates a 0-10 ranking for each university in a student's top 10 list
- **Detailed Explanations**: Provides specific reasons for each ranking
- **Batch Processing**: Ability to process multiple students and generate comprehensive reports
- **Interactive Mode**: Command-line interface for individual student evaluations
- **Fuzzy Matching**: Implements adaptive thresholds and similarity weighting for optimal matching

## Files

- `university_matcher.py`: Core matching algorithm and ranking generator
- `interactive_matcher.py`: Interactive command-line interface for individual students
- `batch_processor.py`: Process all students and generate reports
- `demo.py`: Demonstration script with a sample student
- `exchange_program_dataset_updated.csv`: Sample student data
- `university_requirements.csv`: University requirements database

## Usage

### Demo

Run the demo to see the system in action with a sample student:

```bash
python demo.py
```

### Interactive Mode

For individual student evaluations:

```bash
python interactive_matcher.py
```

### Batch Processing

To process all students in the dataset and generate reports:

```bash
python batch_processor.py
```

## Data Format

### Student Data

The student data CSV should have the following columns:
- First Name
- Last Name
- Sex
- Email
- GPA (2.0-4.3)
- IELTS (6.0-9.0)
- Top 10 (comma-separated list of universities)
- Consent
- Extra Co-Curriculars (format: "Activity -> (Description)")
- Credit Transfer Requirement (comma-separated course codes)

### University Requirements

The university requirements CSV should have the following columns:
- University Name
- Min GPA
- Min IELTS
- Required Extracurriculars
- Engineering Credit Transfer
- Science Credit Transfer
- Business Credit Transfer
- Additional Requirements

## Algorithm

The matching algorithm:

1. Compares student GPA and IELTS scores against university minimums
2. Evaluates extracurricular activities against university requirements
3. Calculates credit transfer potential based on course overlap
4. Applies weighted scoring to generate a final ranking (0-10)
5. Generates detailed explanations for each component

## Extending the System

To enhance the system:
- Add more university data to the requirements database
- Implement NLP for better field detection and course matching
- Integrate with IBM WatsonX for enhanced matching capabilities
- Add a web interface for easier access
