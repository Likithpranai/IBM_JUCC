#!/usr/bin/env python3
"""
Connection System for Exchange Program Students
"""
import pandas as pd
import numpy as np
from fuzzywuzzy import fuzz
import json
from sample_data import outgoing_students, incoming_students, alumni, past_exchange_students

class ConnectionSystem:
    """
    A system to connect exchange students with relevant contacts
    """
    
    def __init__(self):
        """Initialize the connection system with sample data"""
        self.outgoing_students = outgoing_students
        self.incoming_students = incoming_students
        self.alumni = alumni
        self.past_exchange_students = past_exchange_students
        
        # Convert to pandas DataFrames for easier manipulation
        self.outgoing_df = pd.DataFrame(self.outgoing_students)
        self.incoming_df = pd.DataFrame(self.incoming_students)
        self.alumni_df = pd.DataFrame(self.alumni)
        self.past_exchange_df = pd.DataFrame(self.past_exchange_students)
    
    def find_exchange_partner(self, student_id):
        """
        Find the exchange partner for a given student
        (HKUST student going to university X <-> University X student coming to HKUST)
        """
        # Check if the student is outgoing or incoming
        outgoing_match = self.outgoing_df[self.outgoing_df['id'] == student_id]
        incoming_match = self.incoming_df[self.incoming_df['id'] == student_id]
        
        if not outgoing_match.empty:
            # This is an outgoing HKUST student
            student = outgoing_match.iloc[0]
            exchange_university = student['exchange_university']
            exchange_period = student['exchange_period']
            
            # Find incoming students from that university
            partners = self.incoming_df[
                (self.incoming_df['home_university'] == exchange_university) & 
                (self.incoming_df['exchange_period'] == exchange_period)
            ]
            
            # Calculate interest similarity for better matching
            if not partners.empty:
                best_match = None
                highest_similarity = -1
                
                for _, partner in partners.iterrows():
                    # Calculate interest similarity
                    similarity = self._calculate_interest_similarity(
                        student['interests'], partner['interests']
                    )
                    
                    if similarity > highest_similarity:
                        highest_similarity = similarity
                        best_match = partner.to_dict()
                
                if best_match:
                    return {
                        "match_type": "exchange_partner",
                        "student": student.to_dict(),
                        "partner": best_match,
                        "similarity_score": highest_similarity,
                        "message": f"We found an exchange partner from {exchange_university} who will be coming to HKUST during {exchange_period}."
                    }
            
            return {
                "match_type": "exchange_partner",
                "student": student.to_dict(),
                "partner": None,
                "message": f"No matching exchange partner found from {exchange_university} for {exchange_period}."
            }
            
        elif not incoming_match.empty:
            # This is an incoming student to HKUST
            student = incoming_match.iloc[0]
            home_university = student['home_university']
            exchange_period = student['exchange_period']
            
            # Find outgoing students to that university
            partners = self.outgoing_df[
                (self.outgoing_df['exchange_university'] == home_university) & 
                (self.outgoing_df['exchange_period'] == exchange_period)
            ]
            
            # Calculate interest similarity for better matching
            if not partners.empty:
                best_match = None
                highest_similarity = -1
                
                for _, partner in partners.iterrows():
                    # Calculate interest similarity
                    similarity = self._calculate_interest_similarity(
                        student['interests'], partner['interests']
                    )
                    
                    if similarity > highest_similarity:
                        highest_similarity = similarity
                        best_match = partner.to_dict()
                
                if best_match:
                    return {
                        "match_type": "exchange_partner",
                        "student": student.to_dict(),
                        "partner": best_match,
                        "similarity_score": highest_similarity,
                        "message": f"We found an exchange partner from HKUST who will be going to {home_university} during {exchange_period}."
                    }
            
            return {
                "match_type": "exchange_partner",
                "student": student.to_dict(),
                "partner": None,
                "message": f"No matching exchange partner found from HKUST going to {home_university} for {exchange_period}."
            }
        
        return {"error": "Student not found in the database."}
    
    def find_alumni_connections(self, student_id):
        """
        Find alumni connections for a student based on their exchange destination
        """
        # Check if the student is in the outgoing database
        student_match = self.outgoing_df[self.outgoing_df['id'] == student_id]
        
        if student_match.empty:
            return {"error": "Student not found in the outgoing database."}
        
        student = student_match.iloc[0]
        exchange_country = student['exchange_country']
        exchange_university = student['exchange_university']
        
        # Find alumni in the same country
        country_alumni = self.alumni_df[
            (self.alumni_df['current_country'] == exchange_country) & 
            (self.alumni_df['willing_to_mentor'] == True)
        ]
        
        # Find alumni at the same university (if any)
        university_alumni = self.alumni_df[
            (self.alumni_df['current_organization'] == exchange_university) & 
            (self.alumni_df['willing_to_mentor'] == True)
        ]
        
        # Calculate interest similarity for better matching
        alumni_matches = []
        
        # Process university alumni first (higher priority)
        for _, alum in university_alumni.iterrows():
            similarity = self._calculate_interest_similarity(
                student['interests'], alum['interests']
            )
            
            alumni_matches.append({
                "alumni": alum.to_dict(),
                "similarity_score": similarity,
                "connection_type": "university",
                "message": f"HKUST alumnus/a currently working at {exchange_university}"
            })
        
        # Then process country alumni
        for _, alum in country_alumni.iterrows():
            # Skip if already included in university alumni
            if alum['id'] in university_alumni['id'].values:
                continue
                
            similarity = self._calculate_interest_similarity(
                student['interests'], alum['interests']
            )
            
            alumni_matches.append({
                "alumni": alum.to_dict(),
                "similarity_score": similarity,
                "connection_type": "country",
                "message": f"HKUST alumnus/a currently living in {exchange_country}"
            })
        
        # Sort by similarity score
        alumni_matches.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return {
            "match_type": "alumni_connections",
            "student": student.to_dict(),
            "alumni_matches": alumni_matches,
            "total_matches": len(alumni_matches),
            "message": f"Found {len(alumni_matches)} alumni connections for your exchange to {exchange_university}, {exchange_country}."
        }
    
    def find_past_exchange_students(self, student_id):
        """
        Find past exchange students who went to the same university
        """
        # Check if the student is in the outgoing database
        student_match = self.outgoing_df[self.outgoing_df['id'] == student_id]
        
        if student_match.empty:
            return {"error": "Student not found in the outgoing database."}
        
        student = student_match.iloc[0]
        exchange_university = student['exchange_university']
        
        # Find past students who went to the same university
        past_students = self.past_exchange_df[
            (self.past_exchange_df['exchange_university'] == exchange_university) & 
            (self.past_exchange_df['willing_to_advise'] == True)
        ]
        
        past_matches = []
        
        for _, past_student in past_students.iterrows():
            # Calculate major similarity (if they studied the same subject)
            major_similarity = fuzz.ratio(student['major'], past_student['major']) / 100.0
            
            past_matches.append({
                "past_student": past_student.to_dict(),
                "major_similarity": major_similarity,
                "message": f"HKUST student who went to {exchange_university} in {past_student['exchange_period']}"
            })
        
        # Sort by experience rating and then by major similarity
        past_matches.sort(key=lambda x: (x['past_student']['experience_rating'], x['major_similarity']), reverse=True)
        
        return {
            "match_type": "past_exchange_students",
            "student": student.to_dict(),
            "past_matches": past_matches,
            "total_matches": len(past_matches),
            "message": f"Found {len(past_matches)} past exchange students who went to {exchange_university}."
        }
    
    def get_all_connections(self, student_id):
        """
        Get all possible connections for a student
        """
        exchange_partner = self.find_exchange_partner(student_id)
        alumni_connections = self.find_alumni_connections(student_id)
        past_students = self.find_past_exchange_students(student_id)
        
        return {
            "student_id": student_id,
            "exchange_partner": exchange_partner,
            "alumni_connections": alumni_connections,
            "past_exchange_students": past_students
        }
    
    def _calculate_interest_similarity(self, interests1, interests2):
        """
        Calculate similarity between two lists of interests
        """
        if not interests1 or not interests2:
            return 0.0
        
        # Calculate the average fuzzy match score between all pairs of interests
        total_score = 0
        count = 0
        
        for int1 in interests1:
            for int2 in interests2:
                score = fuzz.token_sort_ratio(int1.lower(), int2.lower()) / 100.0
                total_score += score
                count += 1
        
        return total_score / count if count > 0 else 0.0
    
    def generate_connection_report(self, student_id, output_file=None):
        """
        Generate a human-readable connection report for a student
        """
        connections = self.get_all_connections(student_id)
        
        if "error" in connections["exchange_partner"]:
            return f"Error: {connections['exchange_partner']['error']}"
        
        student = connections["exchange_partner"]["student"]
        report = []
        
        # Header
        report.append("=" * 80)
        report.append(f"CONNECTION REPORT FOR: {student['name']} ({student_id})")
        report.append(f"Exchange Destination: {student['exchange_university']}, {student['exchange_country']}")
        report.append(f"Exchange Period: {student['exchange_period']}")
        report.append("=" * 80)
        
        # Exchange Partner Section
        report.append("\n1. EXCHANGE PARTNER")
        report.append("-" * 80)
        
        if connections["exchange_partner"].get("partner"):
            partner = connections["exchange_partner"]["partner"]
            report.append(f"Name: {partner['name']}")
            report.append(f"Email: {partner['email']}")
            report.append(f"Home University: {partner['home_university']}")
            report.append(f"Major: {partner['major']}")
            report.append(f"Interests: {', '.join(partner['interests'])}")
            report.append(f"Languages: {', '.join(partner['languages'])}")
            report.append(f"\nInterest Similarity: {connections['exchange_partner']['similarity_score']:.2f}")
            report.append("\nWe recommend connecting with your exchange partner before your exchange period begins.")
        else:
            report.append("No matching exchange partner found at this time.")
            report.append("We'll notify you if a matching student registers for exchange.")
        
        # Alumni Connections Section
        report.append("\n\n2. ALUMNI CONNECTIONS")
        report.append("-" * 80)
        
        if connections["alumni_connections"].get("alumni_matches"):
            alumni_matches = connections["alumni_connections"]["alumni_matches"]
            report.append(f"Found {len(alumni_matches)} alumni connections in your destination.")
            
            for i, match in enumerate(alumni_matches[:3], 1):  # Show top 3
                alumni = match["alumni"]
                report.append(f"\n{i}. {alumni['name']} ({alumni['position']} at {alumni['current_organization']})")
                report.append(f"   Location: {alumni['current_city']}, {alumni['current_country']}")
                report.append(f"   Email: {alumni['email']}")
                report.append(f"   Graduated: {alumni['graduation_year']} with {alumni['degree']}")
                report.append(f"   Interests: {', '.join(alumni['interests'])}")
                report.append(f"   Connection Type: {match['connection_type']}")
                report.append(f"   Interest Similarity: {match['similarity_score']:.2f}")
            
            if len(alumni_matches) > 3:
                report.append(f"\n... and {len(alumni_matches) - 3} more alumni connections.")
        else:
            report.append("No alumni connections found in your destination at this time.")
        
        # Past Exchange Students Section
        report.append("\n\n3. PAST EXCHANGE STUDENTS")
        report.append("-" * 80)
        
        if connections["past_exchange_students"].get("past_matches"):
            past_matches = connections["past_exchange_students"]["past_matches"]
            report.append(f"Found {len(past_matches)} past students who went to {student['exchange_university']}.")
            
            for i, match in enumerate(past_matches[:3], 1):  # Show top 3
                past = match["past_student"]
                report.append(f"\n{i}. {past['name']} ({past['exchange_period']})")
                report.append(f"   Email: {past['email']}")
                report.append(f"   Major: {past['major']}")
                report.append(f"   Experience Rating: {past['experience_rating']}/10")
                report.append(f"   Can advise on: {', '.join(past['advice_topics'])}")
                report.append(f"   Major Similarity: {match['major_similarity']:.2f}")
            
            if len(past_matches) > 3:
                report.append(f"\n... and {len(past_matches) - 3} more past exchange students.")
        else:
            report.append("No past exchange students found for your destination university.")
        
        # Footer
        report.append("\n" + "=" * 80)
        report.append("NEXT STEPS:")
        report.append("1. Reach out to your connections via email")
        report.append("2. Mention that you were matched through the HKUST Exchange Connection System")
        report.append("3. Ask specific questions about your exchange destination")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
        
        return report_text
