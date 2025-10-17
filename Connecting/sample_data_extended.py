#!/usr/bin/env python3
"""
Extended sample data for the connection system including city/area information
"""
from sample_data import outgoing_students, incoming_students, alumni, past_exchange_students

# Add city/area information to existing outgoing students
outgoing_students_extended = outgoing_students.copy()
for student in outgoing_students_extended:
    if student['exchange_university'] == 'University of British Columbia':
        student['exchange_city'] = 'Vancouver'
        student['exchange_area'] = 'Greater Vancouver'
    elif student['exchange_university'] == 'University of Oxford':
        student['exchange_city'] = 'Oxford'
        student['exchange_area'] = 'Oxfordshire'
    elif student['exchange_university'] == 'MIT':
        student['exchange_city'] = 'Cambridge'
        student['exchange_area'] = 'Greater Boston'
    elif student['exchange_university'] == 'University of Tokyo':
        student['exchange_city'] = 'Tokyo'
        student['exchange_area'] = 'Tokyo Metropolitan Area'
    elif student['exchange_university'] == 'Stanford University':
        student['exchange_city'] = 'Palo Alto'
        student['exchange_area'] = 'San Francisco Bay Area'

# Additional outgoing students in the same areas but different universities
additional_outgoing_students = [
    {
        "id": "O006",
        "name": "Jennifer Lam",
        "email": "jenniferl@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "Harvard University",
        "exchange_country": "USA",
        "exchange_city": "Cambridge",
        "exchange_area": "Greater Boston",
        "exchange_period": "Spring 2026",
        "major": "Biology",
        "interests": ["Research", "Healthcare", "Hiking"],
        "languages": ["English", "Cantonese", "Mandarin"]
    },
    {
        "id": "O007",
        "name": "David Zhang",
        "email": "davidz@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "UC Berkeley",
        "exchange_country": "USA",
        "exchange_city": "Berkeley",
        "exchange_area": "San Francisco Bay Area",
        "exchange_period": "Spring 2026",
        "major": "Computer Science",
        "interests": ["Programming", "Startups", "Basketball"],
        "languages": ["English", "Mandarin"]
    },
    {
        "id": "O008",
        "name": "Sophia Lin",
        "email": "sophial@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "Imperial College London",
        "exchange_country": "UK",
        "exchange_city": "London",
        "exchange_area": "Greater London",
        "exchange_period": "Fall 2025",
        "major": "Chemical Engineering",
        "interests": ["Research", "Travel", "Music"],
        "languages": ["English", "Cantonese"]
    },
    {
        "id": "O009",
        "name": "Jason Kim",
        "email": "jasonk@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "University of Cambridge",
        "exchange_country": "UK",
        "exchange_city": "Cambridge",
        "exchange_area": "Cambridgeshire",
        "exchange_period": "Fall 2025",
        "major": "Physics",
        "interests": ["Research", "Chess", "Classical Music"],
        "languages": ["English", "Korean"]
    },
    {
        "id": "O010",
        "name": "Michelle Wang",
        "email": "michellew@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "Waseda University",
        "exchange_country": "Japan",
        "exchange_city": "Tokyo",
        "exchange_area": "Tokyo Metropolitan Area",
        "exchange_period": "Fall 2025",
        "major": "International Business",
        "interests": ["Languages", "Culture", "Photography"],
        "languages": ["English", "Mandarin", "Japanese"]
    }
]

# Combine original and additional students
all_outgoing_students = outgoing_students_extended + additional_outgoing_students
