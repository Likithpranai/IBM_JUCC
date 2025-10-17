#!/usr/bin/env python3
"""
Demo script for the Connection System
"""
from connection_system import ConnectionSystem
from sample_data import outgoing_students, incoming_students

def run_demo():
    """Run a demonstration of the connection system"""
    print("=" * 80)
    print("EXCHANGE PROGRAM CONNECTION SYSTEM DEMO")
    print("=" * 80)
    
    # Initialize the connection system
    system = ConnectionSystem()
    
    # Display available students for demo
    print("\nAvailable Outgoing Students for Demo:")
    for student in outgoing_students:
        print(f"ID: {student['id']} - {student['name']} going to {student['exchange_university']}")
    
    print("\nAvailable Incoming Students for Demo:")
    for student in incoming_students:
        print(f"ID: {student['id']} - {student['name']} coming from {student['home_university']}")
    
    # Demo scenarios
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 1: Direct Exchange Partner Matching")
    print("=" * 80)
    student_id = "O001"  
    print(f"\nFinding exchange partner for student {student_id}...")
    partner_result = system.find_exchange_partner(student_id)
    
    if partner_result.get("partner"):
        print(f"\nMatch found: {partner_result['partner']['name']} from {partner_result['partner']['home_university']}")
        print(f"Interest similarity score: {partner_result['similarity_score']:.2f}")
        print(f"Interests in common: {set(partner_result['student']['interests']) & set(partner_result['partner']['interests'])}")
    else:
        print("\nNo direct exchange partner found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 2: Alumni Connections")
    print("=" * 80)
    
    # Scenario 2: Find alumni connections for Sarah Chen (going to Oxford)
    student_id = "O002"  # Sarah Chen
    print(f"\nFinding alumni connections for student {student_id}...")
    alumni_result = system.find_alumni_connections(student_id)
    
    if alumni_result.get("alumni_matches"):
        print(f"\nFound {len(alumni_result['alumni_matches'])} alumni connections:")
        for i, match in enumerate(alumni_result['alumni_matches'], 1):
            alumni = match['alumni']
            print(f"\n{i}. {alumni['name']} - {alumni['position']} at {alumni['current_organization']}")
            print(f"   Location: {alumni['current_city']}, {alumni['current_country']}")
            print(f"   Connection type: {match['connection_type']}")
            print(f"   Interest similarity: {match['similarity_score']:.2f}")
    else:
        print("\nNo alumni connections found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 3: Past Exchange Students")
    print("=" * 80)
    
    # Scenario 3: Find past exchange students for Raj Patel (going to MIT)
    student_id = "O003"  # Raj Patel
    print(f"\nFinding past exchange students for student {student_id}...")
    past_result = system.find_past_exchange_students(student_id)
    
    if past_result.get("past_matches"):
        print(f"\nFound {len(past_result['past_matches'])} past exchange students:")
        for i, match in enumerate(past_result['past_matches'], 1):
            past = match['past_student']
            print(f"\n{i}. {past['name']} - Went to {past['exchange_university']} in {past['exchange_period']}")
            print(f"   Major: {past['major']}")
            print(f"   Experience rating: {past['experience_rating']}/10")
            print(f"   Can advise on: {', '.join(past['advice_topics'])}")
            print(f"   Major similarity: {match['major_similarity']:.2f}")
    else:
        print("\nNo past exchange students found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 4: Complete Connection Report")
    print("=" * 80)
    
    # Scenario 4: Generate a complete connection report for Michael Wong (going to Stanford)
    student_id = "O005"  # Michael Wong
    print(f"\nGenerating complete connection report for student {student_id}...")
    
    # Generate and save the report
    report_file = "connection_report.txt"
    report = system.generate_connection_report(student_id, report_file)
    
    print(f"\nConnection report generated and saved to {report_file}")
    print("\nReport preview:")
    print("-" * 40)
    
    # Print first 15 lines of the report as a preview
    preview_lines = report.split('\n')[:15]
    print('\n'.join(preview_lines))
    print("...")
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETED")
    print("=" * 80)

if __name__ == "__main__":
    run_demo()
