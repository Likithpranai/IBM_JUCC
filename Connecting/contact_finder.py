#!/usr/bin/env python3
"""
Contact Finder - Find people to connect with based on exchange program requirements
"""
from connection_system import ConnectionSystem
from area_connection import AreaConnectionSystem
from genai_chatbot_connector import GenAIChatbotConnector

class ContactFinder:
    """
    A system to find people to connect with based on exchange program requirements
    """
    
    def __init__(self):
        """Initialize the contact finder"""
        self.connection_system = ConnectionSystem()
        self.area_system = AreaConnectionSystem()
        self.chatbot_connector = GenAIChatbotConnector()
    
    def find_all_contacts(self, student_id):
        """
        Find all contacts for a student
        
        Args:
            student_id: ID of the student
            
        Returns:
            Dictionary with all contacts
        """
        # Get all connections
        exchange_partner = self.connection_system.find_exchange_partner(student_id)
        alumni_connections = self.connection_system.find_alumni_connections(student_id)
        past_students = self.connection_system.find_past_exchange_students(student_id)
        area_connections = self.area_system.find_area_connections(student_id)
        
        # Format the results
        result = {
            "student": self._format_student(exchange_partner.get("student", {})),
            "exchange_partner": self._format_exchange_partner(exchange_partner.get("partner", {})),
            "alumni_connections": self._format_alumni_connections(alumni_connections.get("alumni_matches", [])),
            "past_students": self._format_past_students(past_students.get("past_matches", [])),
            "area_connections": self._format_area_connections(area_connections.get("area_matches", []))
        }
        
        return result
    
    def _format_student(self, student):
        """Format student information"""
        if not student:
            return {}
        
        return {
            "name": student.get("name", ""),
            "university": student.get("home_university", "HKUST"),
            "exchange_university": student.get("exchange_university", ""),
            "major": student.get("major", ""),
            "contact": {
                "email": student.get("email", ""),
                "phone": "+852 XXXX XXXX",  # Placeholder
                "wechat": student.get("name", "").lower().replace(" ", "_")  # Placeholder
            }
        }
    
    def _format_exchange_partner(self, partner):
        """Format exchange partner information"""
        if not partner:
            return {}
        
        return {
            "name": partner.get("name", ""),
            "university": partner.get("home_university", ""),
            "major": partner.get("major", ""),
            "interests": partner.get("interests", []),
            "contact": {
                "email": partner.get("email", ""),
                "phone": "+1 XXX XXX XXXX",  # Placeholder
                "wechat": partner.get("name", "").lower().replace(" ", "_")  # Placeholder
            }
        }
    
    def _format_alumni_connections(self, alumni_matches):
        """Format alumni connections"""
        result = []
        
        for match in alumni_matches:
            alumni = match.get("alumni", {})
            result.append({
                "name": alumni.get("name", ""),
                "organization": alumni.get("current_organization", ""),
                "position": alumni.get("position", ""),
                "location": f"{alumni.get('current_city', '')}, {alumni.get('current_country', '')}",
                "graduation_year": alumni.get("graduation_year", ""),
                "contact": {
                    "email": alumni.get("email", ""),
                    "phone": alumni.get("phone", "+XXX XXX XXX XXXX"),  # Placeholder
                    "linkedin": alumni.get("name", "").lower().replace(" ", "-")  # Placeholder
                }
            })
        
        return result
    
    def _format_past_students(self, past_matches):
        """Format past students"""
        result = []
        
        for match in past_matches:
            past = match.get("past_student", {})
            result.append({
                "name": past.get("name", ""),
                "university": past.get("exchange_university", ""),
                "major": past.get("major", ""),
                "exchange_period": past.get("exchange_period", ""),
                "experience_rating": past.get("experience_rating", 0),
                "advice_topics": past.get("advice_topics", []),
                "contact": {
                    "email": past.get("email", ""),
                    "phone": "+852 XXXX XXXX",  # Placeholder
                    "wechat": past.get("name", "").lower().replace(" ", "_")  # Placeholder
                }
            })
        
        return result
    
    def _format_area_connections(self, area_matches):
        """Format area connections"""
        result = []
        
        for match in area_matches:
            student = match.get("student", {})
            result.append({
                "name": student.get("name", ""),
                "university": student.get("exchange_university", ""),
                "city": student.get("exchange_city", ""),
                "major": student.get("major", ""),
                "interests": student.get("interests", []),
                "contact": {
                    "email": student.get("email", ""),
                    "phone": "+852 XXXX XXXX",  # Placeholder
                    "wechat": student.get("name", "").lower().replace(" ", "_")  # Placeholder
                }
            })
        
        return result
    
    def generate_contact_report(self, student_id, output_file=None):
        """
        Generate a human-readable contact report
        
        Args:
            student_id: ID of the student
            output_file: Optional file to save the report to
            
        Returns:
            String with contact report
        """
        contacts = self.find_all_contacts(student_id)
        student = contacts["student"]
        
        if not student:
            return f"Error: Student not found (ID: {student_id})"
        
        report = []
        
        # Header
        report.append("=" * 80)
        report.append(f"CONTACT REPORT FOR: {student['name']}")
        report.append(f"Exchange Destination: {student['exchange_university']}")
        report.append("=" * 80)
        
        # Exchange Partner Section
        report.append("\n1. EXCHANGE PARTNER")
        report.append("-" * 80)
        
        partner = contacts["exchange_partner"]
        if partner:
            report.append(f"Name: {partner['name']}")
            report.append(f"University: {partner['university']}")
            report.append(f"Major: {partner['major']}")
            report.append(f"Interests: {', '.join(partner['interests'])}")
            report.append("\nContact Information:")
            report.append(f"Email: {partner['contact']['email']}")
            report.append(f"Phone: {partner['contact']['phone']}")
            report.append(f"WeChat: {partner['contact']['wechat']}")
        else:
            report.append("No matching exchange partner found at this time.")
        
        # Alumni Connections Section
        report.append("\n\n2. ALUMNI CONNECTIONS")
        report.append("-" * 80)
        
        alumni_connections = contacts["alumni_connections"]
        if alumni_connections:
            report.append(f"Found {len(alumni_connections)} alumni connections in your destination.")
            
            for i, alumni in enumerate(alumni_connections, 1):
                report.append(f"\n{i}. {alumni['name']} ({alumni['position']} at {alumni['organization']})")
                report.append(f"   Location: {alumni['location']}")
                report.append(f"   Graduated: {alumni['graduation_year']}")
                report.append("\n   Contact Information:")
                report.append(f"   Email: {alumni['contact']['email']}")
                report.append(f"   Phone: {alumni['contact']['phone']}")
                report.append(f"   LinkedIn: {alumni['contact']['linkedin']}")
        else:
            report.append("No alumni connections found in your destination at this time.")
        
        # Past Exchange Students Section
        report.append("\n\n3. PAST EXCHANGE STUDENTS")
        report.append("-" * 80)
        
        past_students = contacts["past_students"]
        if past_students:
            report.append(f"Found {len(past_students)} past students who went to {student['exchange_university']}.")
            
            for i, past in enumerate(past_students, 1):
                report.append(f"\n{i}. {past['name']} ({past['exchange_period']})")
                report.append(f"   University: {past['university']}")
                report.append(f"   Major: {past['major']}")
                report.append(f"   Experience Rating: {past['experience_rating']}/10")
                report.append(f"   Can advise on: {', '.join(past['advice_topics'])}")
                report.append("\n   Contact Information:")
                report.append(f"   Email: {past['contact']['email']}")
                report.append(f"   Phone: {past['contact']['phone']}")
                report.append(f"   WeChat: {past['contact']['wechat']}")
        else:
            report.append("No past exchange students found for your destination university.")
        
        # Area Connections Section
        report.append("\n\n4. OTHER STUDENTS IN YOUR AREA")
        report.append("-" * 80)
        
        area_connections = contacts["area_connections"]
        if area_connections:
            report.append(f"Found {len(area_connections)} other HKUST students going to your area.")
            
            for i, other in enumerate(area_connections, 1):
                report.append(f"\n{i}. {other['name']}")
                report.append(f"   University: {other['university']}")
                report.append(f"   City: {other['city']}")
                report.append(f"   Major: {other['major']}")
                report.append(f"   Interests: {', '.join(other['interests'])}")
                report.append("\n   Contact Information:")
                report.append(f"   Email: {other['contact']['email']}")
                report.append(f"   Phone: {other['contact']['phone']}")
                report.append(f"   WeChat: {other['contact']['wechat']}")
        else:
            report.append("No other HKUST students found in your area for this exchange period.")
        
        # Chat Access Section
        report.append("\n\n5. CHAT ACCESS")
        report.append("-" * 80)
        report.append("You can chat directly with your connections through our secure platform.")
        report.append("Visit: https://exchange.connect.ust.hk/chat")
        report.append("Login with your HKUST credentials to access your chats.")
        
        # Footer
        report.append("\n" + "=" * 80)
        report.append("NEXT STEPS:")
        report.append("1. Reach out to your connections via email or chat")
        report.append("2. Share your contact information with your connections")
        report.append("3. Schedule video calls to get to know each other better")
        report.append("4. Ask specific questions about your exchange destination")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
        
        return report_text

def run_demo():
    """Run a demonstration of the contact finder"""
    print("=" * 80)
    print("CONTACT FINDER DEMO")
    print("=" * 80)
    
    # Initialize the contact finder
    finder = ContactFinder()
    
    # Display available students for demo
    print("\nAvailable Students for Demo:")
    print("  Li Wei - Going to University of British Columbia")
    print("  Sarah Chen - Going to University of Oxford")
    print("  Raj Patel - Going to MIT")
    print("  Yuki Tanaka - Going to University of Tokyo")
    print("  Michael Wong - Going to Stanford University")
    
    # Demo scenarios
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 1: Find All Contacts for Li Wei")
    print("=" * 80)
    
    # Generate contact report for Li Wei
    report_file = "contact_report_li_wei.txt"
    report = finder.generate_contact_report("O001", report_file)
    
    print(f"\nContact report generated and saved to {report_file}")
    print("\nReport preview:")
    print("-" * 40)
    
    # Print first 20 lines of the report as a preview
    preview_lines = report.split('\n')[:20]
    print('\n'.join(preview_lines))
    print("...")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 2: Find All Contacts for Michael Wong")
    print("=" * 80)
    
    # Generate contact report for Michael Wong
    report_file = "contact_report_michael_wong.txt"
    report = finder.generate_contact_report("O005", report_file)
    
    print(f"\nContact report generated and saved to {report_file}")
    print("\nReport preview:")
    print("-" * 40)
    
    # Print first 20 lines of the report as a preview
    preview_lines = report.split('\n')[:20]
    print('\n'.join(preview_lines))
    print("...")
    
    print("\n" + "=" * 80)
    print("DEMO COMPLETED")
    print("=" * 80)

if __name__ == "__main__":
    run_demo()
