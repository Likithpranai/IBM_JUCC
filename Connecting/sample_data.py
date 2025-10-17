#!/usr/bin/env python3
"""
Sample data for the connection system
"""

# Outgoing exchange students (HKUST students going to other universities)
outgoing_students = [
    {
        "id": "O001",
        "name": "Li Wei",
        "email": "liwei@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "University of British Columbia",
        "exchange_country": "Canada",
        "exchange_period": "Fall 2025",
        "major": "Computer Science",
        "interests": ["Hiking", "Programming", "Photography"],
        "languages": ["English", "Cantonese", "Mandarin"]
    },
    {
        "id": "O002",
        "name": "Sarah Chen",
        "email": "sarahc@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "University of Oxford",
        "exchange_country": "UK",
        "exchange_period": "Fall 2025",
        "major": "Business Management",
        "interests": ["Reading", "Tennis", "Travel"],
        "languages": ["English", "Cantonese"]
    },
    {
        "id": "O003",
        "name": "Raj Patel",
        "email": "rajp@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "MIT",
        "exchange_country": "USA",
        "exchange_period": "Spring 2026",
        "major": "Mechanical Engineering",
        "interests": ["Robotics", "Basketball", "Chess"],
        "languages": ["English", "Hindi"]
    },
    {
        "id": "O004",
        "name": "Yuki Tanaka",
        "email": "yukit@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "University of Tokyo",
        "exchange_country": "Japan",
        "exchange_period": "Fall 2025",
        "major": "Chemical Engineering",
        "interests": ["Anime", "Cooking", "Photography"],
        "languages": ["English", "Japanese", "Cantonese"]
    },
    {
        "id": "O005",
        "name": "Michael Wong",
        "email": "michaelw@connect.ust.hk",
        "home_university": "HKUST",
        "exchange_university": "Stanford University",
        "exchange_country": "USA",
        "exchange_period": "Spring 2026",
        "major": "Computer Science",
        "interests": ["AI", "Swimming", "Music"],
        "languages": ["English", "Cantonese", "Mandarin"]
    }
]

# Incoming exchange students (students coming to HKUST)
incoming_students = [
    {
        "id": "I001",
        "name": "John Smith",
        "email": "johns@ubc.ca",
        "home_university": "University of British Columbia",
        "exchange_university": "HKUST",
        "exchange_country": "Hong Kong",
        "exchange_period": "Fall 2025",
        "major": "Computer Science",
        "interests": ["Gaming", "Hiking", "Cooking"],
        "languages": ["English", "French"]
    },
    {
        "id": "I002",
        "name": "Emma Wilson",
        "email": "emmaw@oxford.ac.uk",
        "home_university": "University of Oxford",
        "exchange_university": "HKUST",
        "exchange_country": "Hong Kong",
        "exchange_period": "Fall 2025",
        "major": "Economics",
        "interests": ["Reading", "Swimming", "Travel"],
        "languages": ["English"]
    },
    {
        "id": "I003",
        "name": "David Kim",
        "email": "davidk@mit.edu",
        "home_university": "MIT",
        "exchange_university": "HKUST",
        "exchange_country": "Hong Kong",
        "exchange_period": "Spring 2026",
        "major": "Electrical Engineering",
        "interests": ["Robotics", "Soccer", "Music"],
        "languages": ["English", "Korean"]
    },
    {
        "id": "I004",
        "name": "Haruki Nakamura",
        "email": "harukin@u-tokyo.ac.jp",
        "home_university": "University of Tokyo",
        "exchange_university": "HKUST",
        "exchange_country": "Hong Kong",
        "exchange_period": "Fall 2025",
        "major": "Physics",
        "interests": ["Anime", "Photography", "Hiking"],
        "languages": ["Japanese", "English"]
    },
    {
        "id": "I005",
        "name": "Jessica Lee",
        "email": "jessical@stanford.edu",
        "home_university": "Stanford University",
        "exchange_university": "HKUST",
        "exchange_country": "Hong Kong",
        "exchange_period": "Spring 2026",
        "major": "Data Science",
        "interests": ["AI", "Volleyball", "Travel"],
        "languages": ["English", "Spanish"]
    }
]

# Alumni database (HKUST alumni living abroad)
alumni = [
    {
        "id": "A001",
        "name": "Dr. James Wong",
        "email": "jameswong@alumni.ust.hk",
        "graduation_year": 2015,
        "degree": "PhD in Computer Science",
        "current_country": "Canada",
        "current_city": "Vancouver",
        "current_organization": "University of British Columbia",
        "position": "Assistant Professor",
        "willing_to_mentor": True,
        "interests": ["Academic Research", "Hiking", "Photography"]
    },
    {
        "id": "A002",
        "name": "Emily Chan",
        "email": "emilychan@alumni.ust.hk",
        "graduation_year": 2018,
        "degree": "MSc in Finance",
        "current_country": "UK",
        "current_city": "London",
        "current_organization": "HSBC",
        "position": "Investment Analyst",
        "willing_to_mentor": True,
        "interests": ["Finance", "Travel", "Food"]
    },
    {
        "id": "A003",
        "name": "Dr. Alex Zhang",
        "email": "alexzhang@alumni.ust.hk",
        "graduation_year": 2016,
        "degree": "PhD in Mechanical Engineering",
        "current_country": "USA",
        "current_city": "Boston",
        "current_organization": "MIT",
        "position": "Research Scientist",
        "willing_to_mentor": True,
        "interests": ["Robotics", "Innovation", "Cycling"]
    },
    {
        "id": "A004",
        "name": "Keiko Yamamoto",
        "email": "keikoy@alumni.ust.hk",
        "graduation_year": 2019,
        "degree": "BSc in Chemistry",
        "current_country": "Japan",
        "current_city": "Tokyo",
        "current_organization": "Mitsubishi Chemical",
        "position": "Research Chemist",
        "willing_to_mentor": True,
        "interests": ["Chemistry", "Traditional Arts", "Cooking"]
    },
    {
        "id": "A005",
        "name": "Daniel Lau",
        "email": "daniellau@alumni.ust.hk",
        "graduation_year": 2017,
        "degree": "MSc in Computer Science",
        "current_country": "USA",
        "current_city": "Palo Alto",
        "current_organization": "Google",
        "position": "Senior Software Engineer",
        "willing_to_mentor": True,
        "interests": ["AI", "Startups", "Basketball"]
    }
]

# Past exchange students (HKUST students who went on exchange in previous years)
past_exchange_students = [
    {
        "id": "P001",
        "name": "Thomas Cheung",
        "email": "thomasc@alumni.ust.hk",
        "exchange_university": "University of British Columbia",
        "exchange_country": "Canada",
        "exchange_period": "Fall 2023",
        "major": "Environmental Science",
        "experience_rating": 9,
        "willing_to_advise": True,
        "advice_topics": ["Housing", "Courses", "Local Transportation"]
    },
    {
        "id": "P002",
        "name": "Sophia Wang",
        "email": "sophiaw@alumni.ust.hk",
        "exchange_university": "University of Oxford",
        "exchange_country": "UK",
        "exchange_period": "Spring 2024",
        "major": "Literature",
        "experience_rating": 10,
        "willing_to_advise": True,
        "advice_topics": ["Academic System", "Cultural Adjustment", "Travel Tips"]
    },
    {
        "id": "P003",
        "name": "Kevin Park",
        "email": "kevinp@alumni.ust.hk",
        "exchange_university": "MIT",
        "exchange_country": "USA",
        "exchange_period": "Fall 2024",
        "major": "Physics",
        "experience_rating": 8,
        "willing_to_advise": True,
        "advice_topics": ["Research Opportunities", "Campus Life", "Networking"]
    },
    {
        "id": "P004",
        "name": "Akiko Sato",
        "email": "akikos@alumni.ust.hk",
        "exchange_university": "University of Tokyo",
        "exchange_country": "Japan",
        "exchange_period": "Spring 2023",
        "major": "Asian Studies",
        "experience_rating": 9,
        "willing_to_advise": True,
        "advice_topics": ["Language Barrier", "Cultural Immersion", "Local Customs"]
    },
    {
        "id": "P005",
        "name": "Brandon Lee",
        "email": "brandonl@alumni.ust.hk",
        "exchange_university": "Stanford University",
        "exchange_country": "USA",
        "exchange_period": "Fall 2023",
        "major": "Computer Science",
        "experience_rating": 10,
        "willing_to_advise": True,
        "advice_topics": ["Silicon Valley Connections", "Internships", "Academic Excellence"]
    }
]
