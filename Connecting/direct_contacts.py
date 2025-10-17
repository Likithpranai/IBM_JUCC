#!/usr/bin/env python3
"""
Direct Contacts Display - Show contact information directly in the output
"""
from connection_system import ConnectionSystem
from area_connection import AreaConnectionSystem

def display_contacts(student_id):
    """Display all contacts for a student directly in the output"""
    # Initialize systems
    connection_system = ConnectionSystem()
    area_system = AreaConnectionSystem()
    
    # Get student info
    exchange_partner = connection_system.find_exchange_partner(student_id)
    student = exchange_partner.get("student", {})
    
    if not student:
        print(f"Error: Student not found")
        return
    
    # Print header
    print("=" * 80)
    print(f"CONTACTS FOR: {student.get('name', '')}")
    print(f"Exchange Destination: {student.get('exchange_university', '')}")
    print("=" * 80)
    
    # Print exchange partner
    print("\n1. EXCHANGE PARTNER")
    print("-" * 80)
    
    partner = exchange_partner.get("partner", {})
    if partner:
        print(f"Name: {partner.get('name', '')}")
        print(f"University: {partner.get('home_university', '')}")
        print(f"Major: {partner.get('major', '')}")
        print(f"Interests: {', '.join(partner.get('interests', []))}")
        print("\nContact Information:")
        print(f"Email: {partner.get('email', '')}")
        print(f"Phone: +1 XXX XXX XXXX")  # Placeholder
        print(f"WeChat: {partner.get('name', '').lower().replace(' ', '_')}")  # Placeholder
    else:
        print("No matching exchange partner found at this time.")
    
    # Print alumni connections
    print("\n2. ALUMNI CONNECTIONS")
    print("-" * 80)
    
    alumni_connections = connection_system.find_alumni_connections(student_id)
    alumni_matches = alumni_connections.get("alumni_matches", [])
    
    if alumni_matches:
        print(f"Found {len(alumni_matches)} alumni connections in your destination.")
        
        for i, match in enumerate(alumni_matches, 1):
            alumni = match.get("alumni", {})
            print(f"\n{i}. {alumni.get('name', '')} ({alumni.get('position', '')} at {alumni.get('current_organization', '')})")
            print(f"   Location: {alumni.get('current_city', '')}, {alumni.get('current_country', '')}")
            print(f"   Graduated: {alumni.get('graduation_year', '')}")
            print("\n   Contact Information:")
            print(f"   Email: {alumni.get('email', '')}")
            print(f"   Phone: +XXX XXX XXX XXXX")  # Placeholder
            print(f"   LinkedIn: {alumni.get('name', '').lower().replace(' ', '-')}")  # Placeholder
    else:
        print("No alumni connections found in your destination at this time.")
    
    # Print past exchange students
    print("\n3. PAST EXCHANGE STUDENTS")
    print("-" * 80)
    
    past_students = connection_system.find_past_exchange_students(student_id)
    past_matches = past_students.get("past_matches", [])
    
    if past_matches:
        print(f"Found {len(past_matches)} past students who went to {student.get('exchange_university', '')}.")
        
        for i, match in enumerate(past_matches, 1):
            past = match.get("past_student", {})
            print(f"\n{i}. {past.get('name', '')} ({past.get('exchange_period', '')})")
            print(f"   University: {past.get('exchange_university', '')}")
            print(f"   Major: {past.get('major', '')}")
            print(f"   Experience Rating: {past.get('experience_rating', 0)}/10")
            print(f"   Can advise on: {', '.join(past.get('advice_topics', []))}")
            print("\n   Contact Information:")
            print(f"   Email: {past.get('email', '')}")
            print(f"   Phone: +852 XXXX XXXX")  # Placeholder
            print(f"   WeChat: {past.get('name', '').lower().replace(' ', '_')}")  # Placeholder
    else:
        print("No past exchange students found for your destination university.")
    
    # Print area connections
    print("\n4. OTHER STUDENTS IN YOUR AREA")
    print("-" * 80)
    
    area_connections = area_system.find_area_connections(student_id)
    area_matches = area_connections.get("area_matches", [])
    
    if area_matches:
        print(f"Found {len(area_matches)} other HKUST students going to your area.")
        
        for i, match in enumerate(area_matches, 1):
            other = match.get("student", {})
            print(f"\n{i}. {other.get('name', '')}")
            print(f"   University: {other.get('exchange_university', '')}")
            print(f"   City: {other.get('exchange_city', '')}")
            print(f"   Major: {other.get('major', '')}")
            print(f"   Interests: {', '.join(other.get('interests', []))}")
            print("\n   Contact Information:")
            print(f"   Email: {other.get('email', '')}")
            print(f"   Phone: +852 XXXX XXXX")  # Placeholder
            print(f"   WeChat: {other.get('name', '').lower().replace(' ', '_')}")  # Placeholder
    else:
        print("No other HKUST students found in your area for this exchange period.")
    
    # Print chat access
    print("\n5. CHAT ACCESS")
    print("-" * 80)
    print("You can chat directly with your connections through our secure platform.")
    print("Visit: https://exchange.connect.ust.hk/chat")
    print("Login with your HKUST credentials to access your chats.")
    
    # Print footer
    print("\n" + "=" * 80)
    print("NEXT STEPS:")
    print("1. Reach out to your connections via email or chat")
    print("2. Share your contact information with your connections")
    print("3. Schedule video calls to get to know each other better")
    print("4. Ask specific questions about your exchange destination")
    print("=" * 80)

def run_demo():
    """Run a demonstration of direct contacts display"""
    print("=" * 80)
    print("DIRECT CONTACTS DISPLAY DEMO")
    print("=" * 80)
    
    # Display available students for demo
    print("\nAvailable Students for Demo:")
    print("1. Li Wei - Going to University of British Columbia")
    print("2. Sarah Chen - Going to University of Oxford")
    print("3. Raj Patel - Going to MIT")
    print("4. Yuki Tanaka - Going to University of Tokyo")
    print("5. Michael Wong - Going to Stanford University")
    
    # Ask for student selection
    print("\nSelect a student (1-5) to display contacts:")
    
    # For demo purposes, we'll show contacts for Li Wei and Michael Wong
    print("\nShowing contacts for Li Wei (Student 1):")
    print("-" * 40)
    display_contacts("O001")  # Li Wei
    
    print("\n\nShowing contacts for Michael Wong (Student 5):")
    print("-" * 40)
    display_contacts("O005")  # Michael Wong
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETED")
    print("=" * 80)

if __name__ == "__main__":
    run_demo()
