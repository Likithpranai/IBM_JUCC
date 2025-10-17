#!/usr/bin/env python3
"""
Demo script for the GenAI-Enhanced Connection System
"""
from genai_enhanced_connection import GenAIEnhancedConnectionSystem
from sample_data_extended import all_outgoing_students

def run_demo():
    """Run a demonstration of the GenAI-enhanced connection system"""
    print("=" * 80)
    print("GENAI-ENHANCED CONNECTION SYSTEM DEMO")
    print("=" * 80)
    
    # Initialize the GenAI-enhanced connection system
    print("\nInitializing GenAI-enhanced connection system...")
    system = GenAIEnhancedConnectionSystem()
    
    # Display available students for demo
    print("\nAvailable Students for Demo:")
    for student in all_outgoing_students[:5]:  # Show first 5
        print(f"ID: {student['id']} - {student['name']} going to {student['exchange_university']}")
    
    # Demo scenarios
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 1: GenAI-Enhanced Exchange Partner Matching")
    print("=" * 80)
    
    # Scenario 1: Find exchange partner for Li Wei (going to UBC)
    student_id = "O001"  # Li Wei
    print(f"\nFinding exchange partner for student {student_id} with GenAI enhancements...")
    partner_result = system.find_exchange_partner(student_id)
    
    if partner_result.get("partner"):
        print(f"\nMatch found: {partner_result['partner']['name']} from {partner_result['partner']['home_university']}")
        
        # Show GenAI compatibility analysis
        if partner_result.get("genai_compatibility"):
            compatibility = partner_result["genai_compatibility"]
            print(f"\nGenAI Compatibility Analysis:")
            print(f"Score: {compatibility['score']}/10")
            print(f"Analysis: {compatibility['explanation']}")
            print(f"Method: {compatibility['method']}")
        
        # Show conversation starters
        if partner_result.get("conversation_starters"):
            starters = partner_result["conversation_starters"]["starters"]
            print(f"\nSuggested Conversation Starters:")
            for i, starter in enumerate(starters, 1):
                print(f"{i}. {starter}")
    else:
        print("\nNo direct exchange partner found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 2: GenAI-Enhanced Area Connections")
    print("=" * 80)
    
    # Scenario 2: Find area connections for Michael Wong (going to Stanford)
    student_id = "O005"  # Michael Wong
    print(f"\nFinding area connections for student {student_id} with GenAI enhancements...")
    area_result = system.find_area_connections(student_id)
    
    if area_result.get("area_matches"):
        print(f"\nFound {len(area_result['area_matches'])} other students in the {area_result['area']} area:")
        
        for i, match in enumerate(area_result['area_matches'], 1):
            student = match['student']
            print(f"\n{i}. {student['name']} - Going to {student['exchange_university']} in {student['exchange_city']}")
            
            # Show GenAI compatibility analysis
            if match.get("genai_compatibility"):
                compatibility = match["genai_compatibility"]
                print(f"   Compatibility: {compatibility['score']}/10")
                print(f"   Analysis: {compatibility['explanation']}")
            
            # Show conversation starters
            if match.get("conversation_starters"):
                starters = match["conversation_starters"]["starters"]
                print(f"   Suggested Conversation Starter: \"{starters[0]}\"")
        
        # Show area guide
        if area_result.get("area_guide"):
            area_guide = area_result["area_guide"]
            print(f"\nGenAI-Generated Area Guide for {area_result['area']}:")
            print(f"(Generated using {area_guide['method']})")
            
            for section, content in area_guide["sections"].items():
                print(f"\n{section}:")
                print(f"   {content.replace(chr(10), chr(10) + '   ')}")
    else:
        print("\nNo area connections found.")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 3: Complete GenAI-Enhanced Connection Report")
    print("=" * 80)
    
    # Scenario 3: Generate a complete GenAI-enhanced connection report for Raj Patel (going to MIT)
    student_id = "O003"  # Raj Patel
    print(f"\nGenerating complete GenAI-enhanced connection report for student {student_id}...")
    
    # Generate and save the report
    report_file = "genai_enhanced_report.txt"
    report = system.generate_enhanced_connection_report(student_id, report_file)
    
    print(f"\nGenAI-enhanced connection report generated and saved to {report_file}")
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
