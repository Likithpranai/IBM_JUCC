#!/usr/bin/env python3
"""
Messaging and contact sharing system for exchange students
"""
import pandas as pd
from datetime import datetime
import json
import os
from sample_data_extended import all_outgoing_students
from sample_data import incoming_students, alumni, past_exchange_students

class MessagingSystem:
    """
    A system to facilitate messaging and contact sharing between connected students
    """
    
    def __init__(self, data_dir="message_data"):
        """Initialize the messaging system with sample data"""
        self.outgoing_students = all_outgoing_students
        self.incoming_students = incoming_students
        self.alumni = alumni
        self.past_exchange_students = past_exchange_students
        
        # Convert to pandas DataFrames for easier manipulation
        self.outgoing_df = pd.DataFrame(self.outgoing_students)
        self.incoming_df = pd.DataFrame(self.incoming_students)
        self.alumni_df = pd.DataFrame(self.alumni)
        self.past_exchange_df = pd.DataFrame(self.past_exchange_students)
        
        # Create directory for message data if it doesn't exist
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize message database
        self.messages_file = os.path.join(self.data_dir, "messages.json")
        self.contacts_file = os.path.join(self.data_dir, "contacts.json")
        
        # Load or create message database
        if os.path.exists(self.messages_file):
            with open(self.messages_file, 'r') as f:
                self.messages = json.load(f)
        else:
            self.messages = []
            self._save_messages()
        
        # Load or create contacts database
        if os.path.exists(self.contacts_file):
            with open(self.contacts_file, 'r') as f:
                self.contacts = json.load(f)
        else:
            self.contacts = {}
            self._save_contacts()
    
    def get_user_info(self, user_id):
        """
        Get user information based on ID
        """
        # Check if it's an outgoing student
        student_match = self.outgoing_df[self.outgoing_df['id'] == user_id]
        if not student_match.empty:
            student = student_match.iloc[0].to_dict()
            return {
                "id": student["id"],
                "name": student["name"],
                "email": student["email"],
                "type": "outgoing_student",
                "university": student["exchange_university"],
                "major": student["major"]
            }
        
        # Check if it's an incoming student
        student_match = self.incoming_df[self.incoming_df['id'] == user_id]
        if not student_match.empty:
            student = student_match.iloc[0].to_dict()
            return {
                "id": student["id"],
                "name": student["name"],
                "email": student["email"],
                "type": "incoming_student",
                "university": student["home_university"],
                "major": student["major"]
            }
        
        # Check if it's an alumnus/a
        alumni_match = self.alumni_df[self.alumni_df['id'] == user_id]
        if not alumni_match.empty:
            alum = alumni_match.iloc[0].to_dict()
            return {
                "id": alum["id"],
                "name": alum["name"],
                "email": alum["email"],
                "type": "alumni",
                "organization": alum["current_organization"],
                "position": alum["position"]
            }
        
        # Check if it's a past exchange student
        past_match = self.past_exchange_df[self.past_exchange_df['id'] == user_id]
        if not past_match.empty:
            past = past_match.iloc[0].to_dict()
            return {
                "id": past["id"],
                "name": past["name"],
                "email": past["email"],
                "type": "past_exchange_student",
                "university": past["exchange_university"],
                "major": past["major"]
            }
        
        return None
    
    def send_message(self, sender_id, recipient_id, message_text):
        """
        Send a message from one user to another
        """
        sender = self.get_user_info(sender_id)
        recipient = self.get_user_info(recipient_id)
        
        if not sender or not recipient:
            return {"error": "Invalid sender or recipient ID"}
        
        # Create message
        message = {
            "id": f"msg_{len(self.messages) + 1}",
            "sender_id": sender_id,
            "recipient_id": recipient_id,
            "text": message_text,
            "timestamp": datetime.now().isoformat(),
            "read": False
        }
        
        # Add to messages database
        self.messages.append(message)
        self._save_messages()
        
        # Add to contacts if not already there
        self._add_to_contacts(sender_id, recipient_id)
        
        return {
            "status": "success",
            "message": message,
            "sender": sender,
            "recipient": recipient
        }
    
    def get_messages(self, user_id, contact_id=None):
        """
        Get messages for a user, optionally filtered by contact
        """
        if not self.get_user_info(user_id):
            return {"error": "Invalid user ID"}
        
        if contact_id and not self.get_user_info(contact_id):
            return {"error": "Invalid contact ID"}
        
        # Filter messages
        if contact_id:
            user_messages = [
                msg for msg in self.messages 
                if (msg["sender_id"] == user_id and msg["recipient_id"] == contact_id) or 
                   (msg["sender_id"] == contact_id and msg["recipient_id"] == user_id)
            ]
        else:
            user_messages = [
                msg for msg in self.messages 
                if msg["sender_id"] == user_id or msg["recipient_id"] == user_id
            ]
        
        # Sort by timestamp
        user_messages.sort(key=lambda x: x["timestamp"])
        
        return {
            "user_id": user_id,
            "contact_id": contact_id,
            "messages": user_messages,
            "count": len(user_messages)
        }
    
    def get_contacts(self, user_id):
        """
        Get all contacts for a user
        """
        if not self.get_user_info(user_id):
            return {"error": "Invalid user ID"}
        
        # Get contacts
        user_contacts = self.contacts.get(user_id, [])
        
        # Get detailed info for each contact
        contact_details = []
        for contact_id in user_contacts:
            contact_info = self.get_user_info(contact_id)
            if contact_info:
                # Count unread messages
                unread_count = len([
                    msg for msg in self.messages
                    if msg["sender_id"] == contact_id and 
                       msg["recipient_id"] == user_id and
                       not msg["read"]
                ])
                
                contact_details.append({
                    "contact": contact_info,
                    "unread_messages": unread_count
                })
        
        return {
            "user_id": user_id,
            "contacts": contact_details,
            "count": len(contact_details)
        }
    
    def share_contact(self, user_id, contact_id, target_id):
        """
        Share a contact with another user
        """
        user = self.get_user_info(user_id)
        contact = self.get_user_info(contact_id)
        target = self.get_user_info(target_id)
        
        if not user or not contact or not target:
            return {"error": "Invalid user, contact, or target ID"}
        
        # Check if user has the contact
        user_contacts = self.contacts.get(user_id, [])
        if contact_id not in user_contacts:
            return {"error": "Contact not in user's contact list"}
        
        # Add contact to target's contacts
        self._add_to_contacts(target_id, contact_id)
        
        # Send notification message
        message_text = f"{user['name']} has shared {contact['name']}'s contact information with you."
        self.send_message(user_id, target_id, message_text)
        
        return {
            "status": "success",
            "message": f"Contact {contact['name']} shared with {target['name']}"
        }
    
    def mark_as_read(self, message_id):
        """
        Mark a message as read
        """
        for i, msg in enumerate(self.messages):
            if msg["id"] == message_id:
                self.messages[i]["read"] = True
                self._save_messages()
                return {"status": "success", "message": "Message marked as read"}
        
        return {"error": "Message not found"}
    
    def _add_to_contacts(self, user_id, contact_id):
        """
        Add a contact to a user's contact list
        """
        # Initialize if not exists
        if user_id not in self.contacts:
            self.contacts[user_id] = []
        
        # Add if not already in contacts
        if contact_id not in self.contacts[user_id]:
            self.contacts[user_id].append(contact_id)
            self._save_contacts()
        
        # Add reciprocal contact
        if contact_id not in self.contacts:
            self.contacts[contact_id] = []
        
        if user_id not in self.contacts[contact_id]:
            self.contacts[contact_id].append(user_id)
            self._save_contacts()
    
    def _save_messages(self):
        """
        Save messages to file
        """
        with open(self.messages_file, 'w') as f:
            json.dump(self.messages, f, indent=2)
    
    def _save_contacts(self):
        """
        Save contacts to file
        """
        with open(self.contacts_file, 'w') as f:
            json.dump(self.contacts, f, indent=2)
    
    def generate_conversation_report(self, user_id, contact_id, output_file=None):
        """
        Generate a human-readable conversation report between two users
        """
        user = self.get_user_info(user_id)
        contact = self.get_user_info(contact_id)
        
        if not user or not contact:
            return f"Error: Invalid user or contact ID"
        
        # Get messages between the two users
        conversation = self.get_messages(user_id, contact_id)
        
        report = []
        
        # Header
        report.append("=" * 80)
        report.append(f"CONVERSATION BETWEEN {user['name']} AND {contact['name']}")
        report.append("=" * 80)
        
        # Messages
        if conversation["messages"]:
            for msg in conversation["messages"]:
                sender = self.get_user_info(msg["sender_id"])
                timestamp = datetime.fromisoformat(msg["timestamp"]).strftime("%Y-%m-%d %H:%M:%S")
                report.append(f"\n[{timestamp}] {sender['name']}:")
                report.append(f"{msg['text']}")
        else:
            report.append("\nNo messages found in this conversation.")
        
        # Contact Information
        report.append("\n" + "=" * 80)
        report.append("CONTACT INFORMATION")
        report.append("-" * 80)
        
        report.append(f"\n{user['name']}:")
        report.append(f"Email: {user['email']}")
        if user['type'] == 'outgoing_student' or user['type'] == 'incoming_student':
            report.append(f"Major: {user['major']}")
            report.append(f"University: {user['university']}")
        elif user['type'] == 'alumni':
            report.append(f"Organization: {user['organization']}")
            report.append(f"Position: {user['position']}")
        
        report.append(f"\n{contact['name']}:")
        report.append(f"Email: {contact['email']}")
        if contact['type'] == 'outgoing_student' or contact['type'] == 'incoming_student':
            report.append(f"Major: {contact['major']}")
            report.append(f"University: {contact['university']}")
        elif contact['type'] == 'alumni':
            report.append(f"Organization: {contact['organization']}")
            report.append(f"Position: {contact['position']}")
        
        report.append("\n" + "=" * 80)
        
        report_text = "\n".join(report)
        
        # Save to file if requested
        if output_file:
            with open(output_file, 'w') as f:
                f.write(report_text)
        
        return report_text
