#!/usr/bin/env python3
"""
GenAI-powered chatbot connector for exchange students
"""
import os
import sys
import json
import re
from datetime import datetime

# Add the GenAI_Version directory to the path to import WatsonX modules
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'GenAI_Version'))

try:
    from watsonx_official_matcher import WatsonXOfficialMatcher
    WATSONX_AVAILABLE = True
except ImportError:
    print("Warning: IBM WatsonX modules not available. Using fallback methods.")
    WATSONX_AVAILABLE = False

class GenAIChatbotConnector:
    """
    A GenAI-powered chatbot connector for exchange students
    """
    
    def __init__(self, api_key=None, project_id=None):
        """Initialize the GenAI chatbot connector"""
        self.api_key = api_key
        self.project_id = project_id
        
        # Try to load from config in GenAI_Version folder
        genai_config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'GenAI_Version')
        sys.path.append(genai_config_path)
        try:
            import config
            self.api_key = api_key or getattr(config, 'WATSON_API_KEY', None)
            self.project_id = project_id or getattr(config, 'WATSON_PROJECT_ID', None)
            print(f"Loaded API credentials from GenAI_Version/config.py")
        except ImportError:
            print(f"Could not import config from {genai_config_path}")
            pass
        
        # Initialize WatsonX if available
        self.model = None
        if WATSONX_AVAILABLE and self.api_key and self.project_id:
            try:
                # Get paths to the data files
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                student_data_path = os.path.join(base_dir, 'exchange_program_dataset_updated.csv')
                university_requirements_path = os.path.join(base_dir, 'university_requirements.csv')
                
                # Check if files exist
                if not os.path.exists(student_data_path):
                    print(f"Warning: Student data file not found at {student_data_path}")
                    student_data_path = ''
                
                if not os.path.exists(university_requirements_path):
                    print(f"Warning: University requirements file not found at {university_requirements_path}")
                    university_requirements_path = ''
                
                # Initialize with valid file paths
                self.model = WatsonXOfficialMatcher(
                    student_data_path=student_data_path,
                    university_requirements_path=university_requirements_path,
                    api_key=self.api_key,
                    project_id=self.project_id
                )
                print("WatsonX model initialized successfully for chatbot connector")
            except Exception as e:
                print(f"Error initializing WatsonX model: {e}")
                self.model = None
        
        # Initialize chat history database
        self.chat_history_dir = "chat_history"
        os.makedirs(self.chat_history_dir, exist_ok=True)
    
    def get_direct_connection_info(self, student_id, connection_id):
        """
        Get direct connection information for a student and their connection
        
        Args:
            student_id: ID of the student
            connection_id: ID of the connection
            
        Returns:
            Dictionary with connection information
        """
        # This would typically come from a database
        # For demo purposes, we'll use hardcoded data
        students_info = {
            "O001": {
                "name": "Li Wei",
                "email": "liwei@connect.ust.hk",
                "phone": "+852 9123 4567",
                "wechat": "liwei_hkust",
                "whatsapp": "+852 9123 4567"
            },
            "O002": {
                "name": "Sarah Chen",
                "email": "sarahc@connect.ust.hk",
                "phone": "+852 9234 5678",
                "wechat": "sarahchen_hk",
                "whatsapp": "+852 9234 5678"
            },
            "O003": {
                "name": "Raj Patel",
                "email": "rajp@connect.ust.hk",
                "phone": "+852 9345 6789",
                "wechat": "raj_patel",
                "whatsapp": "+852 9345 6789"
            },
            "O004": {
                "name": "Yuki Tanaka",
                "email": "yukit@connect.ust.hk",
                "phone": "+852 9456 7890",
                "wechat": "yuki_t",
                "whatsapp": "+852 9456 7890"
            },
            "O005": {
                "name": "Michael Wong",
                "email": "michaelw@connect.ust.hk",
                "phone": "+852 9567 8901",
                "wechat": "michael_wong",
                "whatsapp": "+852 9567 8901"
            },
            "I001": {
                "name": "John Smith",
                "email": "johns@ubc.ca",
                "phone": "+1 604 123 4567",
                "wechat": "john_smith_ubc",
                "whatsapp": "+1 604 123 4567"
            },
            "I002": {
                "name": "Emma Wilson",
                "email": "emmaw@oxford.ac.uk",
                "phone": "+44 7123 456789",
                "wechat": "emma_wilson",
                "whatsapp": "+44 7123 456789"
            },
            "I003": {
                "name": "David Kim",
                "email": "davidk@mit.edu",
                "phone": "+1 617 123 4567",
                "wechat": "david_kim_mit",
                "whatsapp": "+1 617 123 4567"
            },
            "A001": {
                "name": "Dr. James Wong",
                "email": "jameswong@alumni.ust.hk",
                "phone": "+1 604 234 5678",
                "linkedin": "jameswong-phd"
            },
            "A002": {
                "name": "Emily Chan",
                "email": "emilychan@alumni.ust.hk",
                "phone": "+44 7234 567890",
                "linkedin": "emilychan-finance"
            },
            "P001": {
                "name": "Thomas Cheung",
                "email": "thomasc@alumni.ust.hk",
                "phone": "+852 9678 9012",
                "wechat": "thomas_c"
            },
            "P002": {
                "name": "Sophia Wang",
                "email": "sophiaw@alumni.ust.hk",
                "phone": "+852 9789 0123",
                "wechat": "sophia_wang"
            }
        }
        
        # Get student and connection info
        student_info = students_info.get(student_id, {})
        connection_info = students_info.get(connection_id, {})
        
        if not student_info or not connection_info:
            return {
                "error": "Student or connection not found",
                "student_id": student_id,
                "connection_id": connection_id
            }
        
        # Create a unique chat ID for these two users
        chat_id = f"{min(student_id, connection_id)}_{max(student_id, connection_id)}"
        
        return {
            "student": student_info,
            "connection": connection_info,
            "chat_id": chat_id,
            "chat_url": f"/chat/{chat_id}",
            "connection_time": datetime.now().isoformat()
        }
    
    def send_chat_message(self, chat_id, sender_id, message_text):
        """
        Send a chat message between connected students
        
        Args:
            chat_id: ID of the chat
            sender_id: ID of the message sender
            message_text: Text of the message
            
        Returns:
            Dictionary with message information
        """
        # Create chat history file if it doesn't exist
        chat_file = os.path.join(self.chat_history_dir, f"{chat_id}.json")
        
        if os.path.exists(chat_file):
            with open(chat_file, 'r') as f:
                chat_history = json.load(f)
        else:
            chat_history = {
                "chat_id": chat_id,
                "participants": chat_id.split('_'),
                "messages": []
            }
        
        # Add message to chat history
        message = {
            "id": f"msg_{len(chat_history['messages']) + 1}",
            "sender_id": sender_id,
            "text": message_text,
            "timestamp": datetime.now().isoformat(),
            "read": False
        }
        
        chat_history["messages"].append(message)
        
        # Save chat history
        with open(chat_file, 'w') as f:
            json.dump(chat_history, f, indent=2)
        
        # Generate AI response suggestion if needed
        if self.model and self.model.model:
            response_suggestion = self.generate_response_suggestion(chat_history, message)
        else:
            response_suggestion = None
        
        return {
            "status": "success",
            "message": message,
            "chat_id": chat_id,
            "response_suggestion": response_suggestion
        }
    
    def get_chat_history(self, chat_id):
        """
        Get chat history for a chat
        
        Args:
            chat_id: ID of the chat
            
        Returns:
            Dictionary with chat history
        """
        chat_file = os.path.join(self.chat_history_dir, f"{chat_id}.json")
        
        if not os.path.exists(chat_file):
            return {
                "error": "Chat not found",
                "chat_id": chat_id
            }
        
        with open(chat_file, 'r') as f:
            chat_history = json.load(f)
        
        return chat_history
    
    def generate_response_suggestion(self, chat_history, last_message):
        """
        Generate a response suggestion using GenAI
        
        Args:
            chat_history: Dictionary with chat history
            last_message: Dictionary with the last message
            
        Returns:
            String with response suggestion
        """
        if not self.model or not self.model.model:
            return None
        
        # Create a prompt for WatsonX
        prompt = self._create_response_suggestion_prompt(chat_history, last_message)
        
        try:
            # Generate response using WatsonX
            response = self.model.model.generate(prompt=prompt)
            
            # Parse the response
            result = self._parse_response_suggestion_response(response)
            
            return result
        except Exception as e:
            print(f"Error generating response suggestion: {e}")
            return None
    
    def _create_response_suggestion_prompt(self, chat_history, last_message):
        """Create a prompt for response suggestion"""
        # Get the last 5 messages for context
        messages = chat_history["messages"][-5:]
        
        # Format messages for the prompt
        messages_text = ""
        for msg in messages:
            messages_text += f"{msg['sender_id']}: {msg['text']}\n"
        
        prompt = f"""
        You are an AI assistant helping exchange students communicate with each other. Based on the chat history below, suggest a natural, friendly response that the recipient could send.
        
        CHAT HISTORY:
        {messages_text}
        
        The last message was from {last_message['sender_id']}.
        
        Suggest a response that:
        1. Is natural and conversational
        2. Addresses the topics or questions in the last message
        3. Continues the conversation in a friendly way
        4. Is specific to the context of exchange students
        
        Provide ONLY the suggested response text, without any explanations or formatting.
        """
        return prompt
    
    def _parse_response_suggestion_response(self, response):
        """Parse the response suggestion response from WatsonX"""
        try:
            # Get the generated text
            generated_text = response['results'][0]['generated_text']
            
            # Clean up the text
            clean_text = ''.join(c if ord(c) >= 32 else ' ' for c in generated_text)
            
            # Remove any AI prefixes like "Response:" or "Suggestion:"
            clean_text = re.sub(r'^(Response:|Suggestion:|Here\'s a suggested response:)\s*', '', clean_text, flags=re.IGNORECASE)
            
            return clean_text.strip()
                
        except Exception as e:
            print(f"Error parsing response suggestion: {e}")
            return None
    
    def generate_connection_card(self, student_id, connection_id):
        """
        Generate a connection card with contact information and chat access
        
        Args:
            student_id: ID of the student
            connection_id: ID of the connection
            
        Returns:
            String with HTML connection card
        """
        # Get connection info
        connection_info = self.get_direct_connection_info(student_id, connection_id)
        
        if "error" in connection_info:
            return f"Error: {connection_info['error']}"
        
        student = connection_info["student"]
        connection = connection_info["connection"]
        chat_id = connection_info["chat_id"]
        chat_url = connection_info["chat_url"]
        
        # Generate connection card HTML
        card = f"""
        <div class="connection-card">
            <div class="connection-header">
                <h2>{connection['name']}</h2>
                <span class="connection-type">Direct Connection</span>
            </div>
            
            <div class="connection-body">
                <div class="contact-info">
                    <h3>Contact Information</h3>
                    <p><strong>Email:</strong> <a href="mailto:{connection['email']}">{connection['email']}</a></p>
                    <p><strong>Phone:</strong> <a href="tel:{connection['phone']}">{connection['phone']}</a></p>
        """
        
        # Add social media if available
        if "wechat" in connection:
            card += f'            <p><strong>WeChat:</strong> {connection["wechat"]}</p>\n'
        
        if "whatsapp" in connection:
            card += f'            <p><strong>WhatsApp:</strong> <a href="https://wa.me/{connection["whatsapp"].replace(" ", "")}">{connection["whatsapp"]}</a></p>\n'
        
        if "linkedin" in connection:
            card += f'            <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/{connection["linkedin"]}">{connection["linkedin"]}</a></p>\n'
        
        # Add chat access
        card += f"""
                </div>
                
                <div class="chat-access">
                    <h3>Chat Access</h3>
                    <p>You can chat directly with {connection['name']} through our secure platform.</p>
                    <a href="{chat_url}" class="chat-button">Open Chat</a>
                </div>
            </div>
        </div>
        """
        
        return card
    
    def generate_connection_report(self, student_id, connection_ids, output_file=None):
        """
        Generate a human-readable connection report with direct contact information
        
        Args:
            student_id: ID of the student
            connection_ids: List of connection IDs
            output_file: Optional file to save the report to
            
        Returns:
            String with connection report
        """
        # This would typically come from a database
        # For demo purposes, we'll use hardcoded data
        students_info = {
            "O001": {"name": "Li Wei", "exchange_university": "University of British Columbia"},
            "O002": {"name": "Sarah Chen", "exchange_university": "University of Oxford"},
            "O003": {"name": "Raj Patel", "exchange_university": "MIT"},
            "O004": {"name": "Yuki Tanaka", "exchange_university": "University of Tokyo"},
            "O005": {"name": "Michael Wong", "exchange_university": "Stanford University"},
            "I001": {"name": "John Smith", "home_university": "University of British Columbia"},
            "I002": {"name": "Emma Wilson", "home_university": "University of Oxford"},
            "I003": {"name": "David Kim", "home_university": "MIT"},
            "A001": {"name": "Dr. James Wong", "organization": "University of British Columbia"},
            "A002": {"name": "Emily Chan", "organization": "HSBC"},
            "P001": {"name": "Thomas Cheung", "exchange_university": "University of British Columbia"},
            "P002": {"name": "Sophia Wang", "exchange_university": "University of Oxford"}
        }
        
        student = students_info.get(student_id, {"name": "Unknown Student"})
        report = []
        
        # Header
        report.append("=" * 80)
        report.append(f"DIRECT CONNECTION REPORT FOR: {student['name']} ({student_id})")
        if "exchange_university" in student:
            report.append(f"Exchange Destination: {student['exchange_university']}")
        report.append("=" * 80)
        
        # Connections Section
        report.append("\nYOUR DIRECT CONNECTIONS")
        report.append("-" * 80)
        
        if connection_ids:
            for i, connection_id in enumerate(connection_ids, 1):
                connection_info = self.get_direct_connection_info(student_id, connection_id)
                
                if "error" in connection_info:
                    report.append(f"\n{i}. Error: Connection not found ({connection_id})")
                    continue
                
                connection = connection_info["connection"]
                chat_id = connection_info["chat_id"]
                
                report.append(f"\n{i}. {connection['name']}")
                report.append(f"   Email: {connection['email']}")
                report.append(f"   Phone: {connection['phone']}")
                
                # Add social media if available
                if "wechat" in connection:
                    report.append(f"   WeChat: {connection['wechat']}")
                
                if "whatsapp" in connection:
                    report.append(f"   WhatsApp: {connection['whatsapp']}")
                
                if "linkedin" in connection:
                    report.append(f"   LinkedIn: {connection['linkedin']}")
                
                # Add chat access
                report.append(f"   Chat ID: {chat_id}")
                report.append(f"   Chat URL: /chat/{chat_id}")
        else:
            report.append("\nNo direct connections found.")
        
        # Footer
        report.append("\n" + "=" * 80)
        report.append("NEXT STEPS:")
        report.append("1. Reach out to your connections via email or phone")
        report.append("2. Use the chat platform for secure communication")
        report.append("3. Share your contact information with your connections")
        report.append("=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
        
        return report_text
