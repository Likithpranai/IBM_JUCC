#!/usr/bin/env python3
"""
GenAI-enhanced connection system for exchange students
"""
import pandas as pd
from connection_system import ConnectionSystem
from area_connection import AreaConnectionSystem
from messaging_system import MessagingSystem
from genai_connector import GenAIConnector
from sample_data_extended import all_outgoing_students
from sample_data import incoming_students, alumni, past_exchange_students

class GenAIEnhancedConnectionSystem:
    """
    A connection system enhanced with GenAI capabilities
    """
    
    def __init__(self, api_key=None, project_id=None):
        """Initialize the GenAI-enhanced connection system"""
        # Initialize base systems
        self.connection_system = ConnectionSystem()
        self.area_system = AreaConnectionSystem()
        self.messaging_system = MessagingSystem()
        
        # Initialize GenAI connector
        self.genai = GenAIConnector(api_key, project_id)
        
        # Convert to pandas DataFrames for easier manipulation
        self.outgoing_df = pd.DataFrame(all_outgoing_students)
        self.incoming_df = pd.DataFrame(incoming_students)
        self.alumni_df = pd.DataFrame(alumni)
        self.past_exchange_df = pd.DataFrame(past_exchange_students)
    
    def find_exchange_partner(self, student_id):
        """
        Find the exchange partner for a given student with GenAI-enhanced compatibility analysis
        """
        # Get basic exchange partner match
        basic_match = self.connection_system.find_exchange_partner(student_id)
        
        # If no partner found, return the basic result
        if not basic_match.get("partner"):
            return basic_match
        
        # Get student and partner info
        student = basic_match["student"]
        partner = basic_match["partner"]
        
        # Enhance with GenAI compatibility analysis
        compatibility = self.genai.analyze_compatibility(student, partner)
        
        # Generate conversation starters
        conversation_starters = self.genai.generate_conversation_starters(student, partner)
        
        # Add GenAI enhancements to the result
        enhanced_match = basic_match.copy()
        enhanced_match["genai_compatibility"] = compatibility
        enhanced_match["conversation_starters"] = conversation_starters
        
        return enhanced_match
    
    def find_area_connections(self, student_id):
        """
        Find area connections with GenAI-enhanced area guide
        """
        # Get basic area connections
        basic_result = self.area_system.find_area_connections(student_id)
        
        # If no area found, return the basic result
        if "error" in basic_result:
            return basic_result
        
        # Get student info and area
        student = basic_result["student"]
        area = basic_result["area"]
        
        # Generate area guide with GenAI
        area_guide = self.genai.generate_area_guide(area, student.get("interests"))
        
        # Add GenAI enhancements to the result
        enhanced_result = basic_result.copy()
        enhanced_result["area_guide"] = area_guide
        
        # Enhance area matches with compatibility analysis
        if basic_result.get("area_matches"):
            enhanced_matches = []
            
            for match in basic_result["area_matches"]:
                other_student = match["student"]
                
                # Analyze compatibility with GenAI
                compatibility = self.genai.analyze_compatibility(student, other_student)
                
                # Generate conversation starters
                conversation_starters = self.genai.generate_conversation_starters(student, other_student)
                
                # Add GenAI enhancements to the match
                enhanced_match = match.copy()
                enhanced_match["genai_compatibility"] = compatibility
                enhanced_match["conversation_starters"] = conversation_starters
                
                enhanced_matches.append(enhanced_match)
            
            enhanced_result["area_matches"] = enhanced_matches
        
        return enhanced_result
    
    def find_alumni_connections(self, student_id):
        """
        Find alumni connections with GenAI-enhanced compatibility analysis
        """
        # Get basic alumni connections
        basic_result = self.connection_system.find_alumni_connections(student_id)
        
        # If no alumni found, return the basic result
        if "error" in basic_result:
            return basic_result
        
        # Get student info
        student = basic_result["student"]
        
        # Enhance alumni matches with compatibility analysis
        if basic_result.get("alumni_matches"):
            enhanced_matches = []
            
            for match in basic_result["alumni_matches"]:
                alumni = match["alumni"]
                
                # Analyze compatibility with GenAI
                compatibility = self.genai.analyze_compatibility(student, alumni)
                
                # Generate conversation starters
                conversation_starters = self.genai.generate_conversation_starters(student, alumni)
                
                # Add GenAI enhancements to the match
                enhanced_match = match.copy()
                enhanced_match["genai_compatibility"] = compatibility
                enhanced_match["conversation_starters"] = conversation_starters
                
                enhanced_matches.append(enhanced_match)
            
            # Sort by GenAI compatibility score (primary) and original similarity (secondary)
            enhanced_matches.sort(
                key=lambda x: (x["genai_compatibility"]["score"], x["similarity_score"]), 
                reverse=True
            )
            
            basic_result["alumni_matches"] = enhanced_matches
        
        return basic_result
    
    def find_past_exchange_students(self, student_id):
        """
        Find past exchange students with GenAI-enhanced compatibility analysis
        """
        # Get basic past exchange student connections
        basic_result = self.connection_system.find_past_exchange_students(student_id)
        
        # If no past students found, return the basic result
        if "error" in basic_result:
            return basic_result
        
        # Get student info
        student = basic_result["student"]
        
        # Enhance past student matches with compatibility analysis
        if basic_result.get("past_matches"):
            enhanced_matches = []
            
            for match in basic_result["past_matches"]:
                past_student = match["past_student"]
                
                # Analyze compatibility with GenAI
                compatibility = self.genai.analyze_compatibility(student, past_student)
                
                # Generate conversation starters
                conversation_starters = self.genai.generate_conversation_starters(student, past_student)
                
                # Add GenAI enhancements to the match
                enhanced_match = match.copy()
                enhanced_match["genai_compatibility"] = compatibility
                enhanced_match["conversation_starters"] = conversation_starters
                
                enhanced_matches.append(enhanced_match)
            
            # Sort by GenAI compatibility score (primary) and experience rating (secondary)
            enhanced_matches.sort(
                key=lambda x: (x["genai_compatibility"]["score"], x["past_student"]["experience_rating"]), 
                reverse=True
            )
            
            basic_result["past_matches"] = enhanced_matches
        
        return basic_result
    
    def get_all_connections(self, student_id):
        """
        Get all possible connections for a student with GenAI enhancements
        """
        exchange_partner = self.find_exchange_partner(student_id)
        alumni_connections = self.find_alumni_connections(student_id)
        past_students = self.find_past_exchange_students(student_id)
        area_connections = self.find_area_connections(student_id)
        
        return {
            "student_id": student_id,
            "exchange_partner": exchange_partner,
            "alumni_connections": alumni_connections,
            "past_exchange_students": past_students,
            "area_connections": area_connections
        }
    
    def generate_enhanced_connection_report(self, student_id, output_file=None):
        """
        Generate a human-readable connection report with GenAI enhancements
        """
        connections = self.get_all_connections(student_id)
        
        if "error" in connections["exchange_partner"]:
            return f"Error: {connections['exchange_partner']['error']}"
        
        student = connections["exchange_partner"]["student"]
        report = []
        
        # Header
        report.append("=" * 80)
        report.append(f"GENAI-ENHANCED CONNECTION REPORT FOR: {student['name']} ({student_id})")
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
            
            # Add GenAI compatibility analysis
            if connections["exchange_partner"].get("genai_compatibility"):
                compatibility = connections["exchange_partner"]["genai_compatibility"]
                report.append(f"\nCompatibility Score: {compatibility['score']}/10")
                report.append(f"Analysis: {compatibility['explanation']}")
                report.append(f"(Analysis method: {compatibility['method']})")
            
            # Add conversation starters
            if connections["exchange_partner"].get("conversation_starters"):
                starters = connections["exchange_partner"]["conversation_starters"]["starters"]
                report.append("\nSuggested Conversation Starters:")
                for i, starter in enumerate(starters, 1):
                    report.append(f"  {i}. {starter}")
            
            report.append("\nWe recommend connecting with your exchange partner before your exchange period begins.")
        else:
            report.append("No matching exchange partner found at this time.")
            report.append("We'll notify you if a matching student registers for exchange.")
        
        # Area Guide Section (if available)
        if connections["area_connections"].get("area_guide"):
            area = connections["area_connections"]["area"]
            area_guide = connections["area_connections"]["area_guide"]
            
            report.append(f"\n\n2. {area.upper()} AREA GUIDE")
            report.append("-" * 80)
            report.append(f"(Generated using {area_guide['method']})")
            
            for section, content in area_guide["sections"].items():
                report.append(f"\n{section}:")
                report.append(content)
        
        # Area Connections Section
        report.append("\n\n3. OTHER STUDENTS IN YOUR AREA")
        report.append("-" * 80)
        
        if connections["area_connections"].get("area_matches"):
            area_matches = connections["area_connections"]["area_matches"]
            report.append(f"Found {len(area_matches)} other HKUST students going to the {connections['area_connections']['area']} area.")
            
            for i, match in enumerate(area_matches[:3], 1):  # Show top 3
                other_student = match["student"]
                report.append(f"\n{i}. {other_student['name']}")
                report.append(f"   University: {other_student['exchange_university']}")
                report.append(f"   City: {other_student['exchange_city']}")
                report.append(f"   Major: {other_student['major']}")
                report.append(f"   Email: {other_student['email']}")
                
                # Add GenAI compatibility analysis
                if match.get("genai_compatibility"):
                    compatibility = match["genai_compatibility"]
                    report.append(f"   Compatibility: {compatibility['score']}/10")
                    report.append(f"   Analysis: {compatibility['explanation']}")
                
                # Add conversation starters
                if match.get("conversation_starters"):
                    starters = match["conversation_starters"]["starters"]
                    report.append("   Suggested Conversation Starter:")
                    report.append(f"   \"{starters[0]}\"")
            
            if len(area_matches) > 3:
                report.append(f"\n... and {len(area_matches) - 3} more students in your area.")
        else:
            report.append("No other HKUST students found in your area for this exchange period.")
        
        # Alumni Connections Section
        report.append("\n\n4. ALUMNI CONNECTIONS")
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
                
                # Add GenAI compatibility analysis
                if match.get("genai_compatibility"):
                    compatibility = match["genai_compatibility"]
                    report.append(f"   Compatibility: {compatibility['score']}/10")
                    report.append(f"   Analysis: {compatibility['explanation']}")
                
                # Add conversation starters
                if match.get("conversation_starters"):
                    starters = match["conversation_starters"]["starters"]
                    report.append("   Suggested Conversation Starter:")
                    report.append(f"   \"{starters[0]}\"")
            
            if len(alumni_matches) > 3:
                report.append(f"\n... and {len(alumni_matches) - 3} more alumni connections.")
        else:
            report.append("No alumni connections found in your destination at this time.")
        
        # Past Exchange Students Section
        report.append("\n\n5. PAST EXCHANGE STUDENTS")
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
                
                # Add GenAI compatibility analysis
                if match.get("genai_compatibility"):
                    compatibility = match["genai_compatibility"]
                    report.append(f"   Compatibility: {compatibility['score']}/10")
                    report.append(f"   Analysis: {compatibility['explanation']}")
                
                # Add conversation starters
                if match.get("conversation_starters"):
                    starters = match["conversation_starters"]["starters"]
                    report.append("   Suggested Conversation Starter:")
                    report.append(f"   \"{starters[0]}\"")
            
            if len(past_matches) > 3:
                report.append(f"\n... and {len(past_matches) - 3} more past exchange students.")
        else:
            report.append("No past exchange students found for your destination university.")
        
        # Footer
        report.append("\n" + "=" * 80)
        report.append("NEXT STEPS:")
        report.append("1. Reach out to your connections via email")
        report.append("2. Use the suggested conversation starters to break the ice")
        report.append("3. Explore your destination area using the personalized area guide")
        report.append("4. Join the HKUST Exchange Program community for more resources")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
        
        return report_text
