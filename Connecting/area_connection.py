#!/usr/bin/env python3
"""
Area-based connection system for exchange students
"""
import pandas as pd
from fuzzywuzzy import fuzz
from sample_data_extended import all_outgoing_students

class AreaConnectionSystem:
    """
    A system to connect exchange students going to the same geographical area
    """
    
    def __init__(self):
        """Initialize the area connection system with sample data"""
        self.outgoing_students = all_outgoing_students
        self.outgoing_df = pd.DataFrame(self.outgoing_students)
    
    def find_area_connections(self, student_id):
        """
        Find other HKUST students going to the same geographical area
        """
        # Check if the student is in the outgoing database
        student_match = self.outgoing_df[self.outgoing_df['id'] == student_id]
        
        if student_match.empty:
            return {"error": "Student not found in the outgoing database."}
        
        student = student_match.iloc[0]
        exchange_area = student['exchange_area']
        exchange_period = student['exchange_period']
        
        # Find other students going to the same area in the same period
        area_students = self.outgoing_df[
            (self.outgoing_df['exchange_area'] == exchange_area) & 
            (self.outgoing_df['exchange_period'] == exchange_period) & 
            (self.outgoing_df['id'] != student_id)  # Exclude the student themselves
        ]
        
        area_matches = []
        
        for _, area_student in area_students.iterrows():
            # Calculate interest similarity
            similarity = self._calculate_interest_similarity(
                student['interests'], area_student['interests']
            )
            
            # Calculate university proximity (same university = 1.0, different = 0.0)
            same_university = 1.0 if student['exchange_university'] == area_student['exchange_university'] else 0.0
            
            area_matches.append({
                "student": area_student.to_dict(),
                "interest_similarity": similarity,
                "same_university": same_university,
                "message": f"HKUST student going to {area_student['exchange_university']} in {area_student['exchange_city']}"
            })
        
        # Sort by interest similarity (primary) and same university (secondary)
        area_matches.sort(key=lambda x: (x['interest_similarity'], x['same_university']), reverse=True)
        
        return {
            "match_type": "area_connections",
            "student": student.to_dict(),
            "area": exchange_area,
            "period": exchange_period,
            "area_matches": area_matches,
            "total_matches": len(area_matches),
            "message": f"Found {len(area_matches)} other HKUST students going to the {exchange_area} area during {exchange_period}."
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
    
    def generate_area_connection_report(self, student_id, output_file=None):
        """
        Generate a human-readable area connection report for a student
        """
        connections = self.find_area_connections(student_id)
        
        if "error" in connections:
            return f"Error: {connections['error']}"
        
        student = connections["student"]
        report = []
        
        # Header
        report.append("=" * 80)
        report.append(f"AREA CONNECTION REPORT FOR: {student['name']} ({student_id})")
        report.append(f"Exchange Destination: {student['exchange_university']}, {student['exchange_city']}")
        report.append(f"Area: {student['exchange_area']}")
        report.append(f"Exchange Period: {student['exchange_period']}")
        report.append("=" * 80)
        
        # Area Connections Section
        report.append("\nOTHER HKUST STUDENTS IN YOUR AREA")
        report.append("-" * 80)
        
        if connections.get("area_matches"):
            area_matches = connections["area_matches"]
            report.append(f"Found {len(area_matches)} other HKUST students going to the {student['exchange_area']} area.")
            
            for i, match in enumerate(area_matches, 1):
                other_student = match["student"]
                report.append(f"\n{i}. {other_student['name']}")
                report.append(f"   University: {other_student['exchange_university']}")
                report.append(f"   City: {other_student['exchange_city']}")
                report.append(f"   Major: {other_student['major']}")
                report.append(f"   Email: {other_student['email']}")
                report.append(f"   Interests: {', '.join(other_student['interests'])}")
                report.append(f"   Languages: {', '.join(other_student['languages'])}")
                report.append(f"   Interest Similarity: {match['interest_similarity']:.2f}")
        else:
            report.append("No other HKUST students found in your area for this exchange period.")
        
        # Footer
        report.append("\n" + "=" * 80)
        report.append("NEXT STEPS:")
        report.append("1. Reach out to students in your area via email")
        report.append("2. Consider organizing meetups or travel plans together")
        report.append("3. Share housing information and local tips")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
        
        return report_text
