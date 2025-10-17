#!/usr/bin/env python3
"""
Demo script for the Area Connection System
"""
from area_connection import AreaConnectionSystem
from sample_data_extended import all_outgoing_students

def run_demo():
    """Run a demonstration of the area connection system"""
    print("=" * 80)
    print("AREA-BASED CONNECTION SYSTEM DEMO")
    print("=" * 80)
    
    # Initialize the area connection system
    system = AreaConnectionSystem()
    
    # Display available students and their areas
    print("\nAvailable Students by Area:")
    
    # Group students by area
    areas = {}
    for student in all_outgoing_students:
        area = student['exchange_area']
        if area not in areas:
            areas[area] = []
        areas[area].append(student)
    
    # Display students by area
    for area, students in areas.items():
        print(f"\n{area}:")
        for student in students:
            print(f"  ID: {student['id']} - {student['name']} going to {student['exchange_university']} in {student['exchange_city']}")
    
    # Demo scenarios
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 1: San Francisco Bay Area Connections")
    print("=" * 80)
    
    # Scenario 1: Find area connections for Michael Wong (going to Stanford)
    student_id = "O005"  # Michael Wong
    print(f"\nFinding area connections for student {student_id} (Michael Wong)...")
    area_result = system.find_area_connections(student_id)
    
    if area_result.get("area_matches"):
        print(f"\nFound {len(area_result['area_matches'])} other students in the {area_result['area']} area:")
        for i, match in enumerate(area_result['area_matches'], 1):
            student = match['student']
            print(f"\n{i}. {student['name']} - Going to {student['exchange_university']} in {student['exchange_city']}")
            print(f"   Major: {student['major']}")
            print(f"   Interest similarity: {match['interest_similarity']:.2f}")
            print(f"   Interests: {', '.join(student['interests'])}")
    else:
        print("\nNo area connections found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 2: Greater Boston Area Connections")
    print("=" * 80)
    
    # Scenario 2: Find area connections for Raj Patel (going to MIT)
    student_id = "O003"  # Raj Patel
    print(f"\nFinding area connections for student {student_id} (Raj Patel)...")
    area_result = system.find_area_connections(student_id)
    
    if area_result.get("area_matches"):
        print(f"\nFound {len(area_result['area_matches'])} other students in the {area_result['area']} area:")
        for i, match in enumerate(area_result['area_matches'], 1):
            student = match['student']
            print(f"\n{i}. {student['name']} - Going to {student['exchange_university']} in {student['exchange_city']}")
            print(f"   Major: {student['major']}")
            print(f"   Interest similarity: {match['interest_similarity']:.2f}")
            print(f"   Interests: {', '.join(student['interests'])}")
    else:
        print("\nNo area connections found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 3: Tokyo Metropolitan Area Connections")
    print("=" * 80)
    
    # Scenario 3: Find area connections for Yuki Tanaka (going to University of Tokyo)
    student_id = "O004"  # Yuki Tanaka
    print(f"\nFinding area connections for student {student_id} (Yuki Tanaka)...")
    area_result = system.find_area_connections(student_id)
    
    if area_result.get("area_matches"):
        print(f"\nFound {len(area_result['area_matches'])} other students in the {area_result['area']} area:")
        for i, match in enumerate(area_result['area_matches'], 1):
            student = match['student']
            print(f"\n{i}. {student['name']} - Going to {student['exchange_university']} in {student['exchange_city']}")
            print(f"   Major: {student['major']}")
            print(f"   Interest similarity: {match['interest_similarity']:.2f}")
            print(f"   Interests: {', '.join(student['interests'])}")
    else:
        print("\nNo area connections found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 4: Complete Area Connection Report")
    print("=" * 80)
    
    # Scenario 4: Generate a complete area connection report for Michael Wong
    student_id = "O005"  # Michael Wong
    print(f"\nGenerating complete area connection report for student {student_id}...")
    
    # Generate and save the report
    report_file = "area_connection_report.txt"
    report = system.generate_area_connection_report(student_id, report_file)
    
    print(f"\nArea connection report generated and saved to {report_file}")
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
