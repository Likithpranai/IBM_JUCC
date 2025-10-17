#!/usr/bin/env python3
"""
Clean demo script for the Messaging and Contact Sharing System
"""
from messaging_system import MessagingSystem
from sample_data_extended import all_outgoing_students
from sample_data import incoming_students, alumni, past_exchange_students
import os
import shutil

def run_demo():
    """Run a clean demonstration of the messaging and contact sharing system"""
    print("=" * 80)
    print("MESSAGING AND CONTACT SHARING SYSTEM DEMO")
    print("=" * 80)
    
    # Clean up previous message data
    data_dir = "message_data"
    if os.path.exists(data_dir):
        shutil.rmtree(data_dir)
    os.makedirs(data_dir, exist_ok=True)
    
    # Initialize the messaging system
    system = MessagingSystem(data_dir)
    
    # Display available users for demo
    print("\nAvailable Users for Demo:")
    
    print("\nOutgoing Students:")
    for student in all_outgoing_students[:5]:  # Show first 5
        print(f"  ID: {student['id']} - {student['name']} going to {student['exchange_university']}")
    
    print("\nIncoming Students:")
    for student in incoming_students[:3]:  # Show first 3
        print(f"  ID: {student['id']} - {student['name']} coming from {student['home_university']}")
    
    print("\nAlumni:")
    for alum in alumni[:3]:  # Show first 3
        print(f"  ID: {alum['id']} - {alum['name']} at {alum['current_organization']}")
    
    print("\nPast Exchange Students:")
    for past in past_exchange_students[:3]:  # Show first 3
        print(f"  ID: {past['id']} - {past['name']} went to {past['exchange_university']}")
    
    # Demo scenarios
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 1: Sending Messages Between Exchange Partners")
    print("=" * 80)
    
    # Scenario 1: Send messages between Li Wei and John Smith (exchange partners)
    print("\nSending messages between exchange partners Li Wei (O001) and John Smith (I001)...")
    
    # Li Wei sends a message to John Smith
    message1 = system.send_message(
        "O001", "I001", 
        "Hi John! I'm Li Wei from HKUST. I'll be coming to UBC next semester while you'll be at HKUST. I thought it would be great to connect since we're part of the same exchange program!"
    )
    
    # John Smith replies
    message2 = system.send_message(
        "I001", "O001", 
        "Hello Li Wei! Great to hear from you. Yes, I'm excited to be going to HKUST while you'll be at my home university UBC. Do you have any tips for living in Hong Kong?"
    )
    
    # Li Wei responds
    message3 = system.send_message(
        "O001", "I001", 
        "Definitely! Hong Kong has amazing food and efficient public transport. I'd recommend getting an Octopus card as soon as you arrive. Also, the weather is quite humid in summer, so be prepared! I'd love to hear about Vancouver as well since I'll be there."
    )
    
    # Show conversation
    print("\nConversation between Li Wei and John Smith:")
    conversation = system.get_messages("O001", "I001")
    
    for msg in conversation["messages"]:
        sender_id = msg["sender_id"]
        sender_name = system.get_user_info(sender_id)["name"]
        print(f"\n{sender_name}: {msg['text']}")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 2: Connecting with Alumni")
    print("=" * 80)
    
    # Scenario 2: Sarah Chen connects with Emily Chan (alumna in UK)
    print("\nSarah Chen (O002) connects with Emily Chan (A002), an alumna in London...")
    
    # Sarah sends a message to Emily
    message4 = system.send_message(
        "O002", "A002", 
        "Hello Ms. Chan, I'm Sarah from HKUST and I'll be going to Oxford next semester. I saw that you're working in London now. Would you have any advice for a student moving to the UK?"
    )
    
    # Emily replies
    message5 = system.send_message(
        "A002", "O002", 
        "Hi Sarah! Great to hear from you. Oxford is a beautiful city. For the UK, I'd recommend opening a bank account as soon as possible and getting a BRP (Biometric Residence Permit). Also, don't forget to register with a GP (doctor) when you arrive. Feel free to reach out if you have specific questions!"
    )
    
    # Show conversation
    print("\nConversation between Sarah Chen and Emily Chan:")
    conversation = system.get_messages("O002", "A002")
    
    for msg in conversation["messages"]:
        sender_id = msg["sender_id"]
        sender_name = system.get_user_info(sender_id)["name"]
        print(f"\n{sender_name}: {msg['text']}")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 3: Contact Sharing")
    print("=" * 80)
    
    # Scenario 3: Sarah Chen shares Emily's contact with Michael Wong
    print("\nSarah Chen (O002) shares Emily Chan's (A002) contact with Michael Wong (O005)...")
    
    # Sarah shares Emily's contact with Michael
    share_result = system.share_contact("O002", "A002", "O005")
    
    # Michael sends a message to Emily
    message6 = system.send_message(
        "O005", "A002", 
        "Hi Ms. Chan, I'm Michael from HKUST. Sarah shared your contact with me. I'll be going to Stanford next semester, but I'm planning to visit the UK during spring break. Would you have any recommendations for places to visit?"
    )
    
    # Show Michael's contacts
    print("\nMichael Wong's contacts after contact sharing:")
    contacts = system.get_contacts("O005")
    
    for contact_info in contacts["contacts"]:
        contact = contact_info["contact"]
        print(f"  {contact['name']} ({contact['id']}) - {contact.get('organization', contact.get('university', 'N/A'))}")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 4: Area-Based Connections and Group Chat")
    print("=" * 80)
    
    # Scenario 4: Michael Wong connects with David Zhang (both in Bay Area)
    print("\nMichael Wong (O005) connects with David Zhang (O007) who will also be in the Bay Area...")
    
    # Michael sends a message to David
    message7 = system.send_message(
        "O005", "O007", 
        "Hi David! I saw that you'll also be in the Bay Area next semester. I'll be at Stanford and you'll be at Berkeley. Maybe we could meet up sometime and explore the area together?"
    )
    
    # David replies
    message8 = system.send_message(
        "O007", "O005", 
        "Hey Michael! That sounds great. I've heard the public transport between Stanford and Berkeley isn't the best, but we could meet in San Francisco on weekends. I'm interested in visiting some tech companies too."
    )
    
    # Michael responds
    message9 = system.send_message(
        "O005", "O007", 
        "Perfect! I'm also interested in visiting tech companies. Let's plan some trips together when we get there. Do you know if there are any other HKUST students going to the Bay Area?"
    )
    
    # Show conversation
    print("\nConversation between Michael Wong and David Zhang:")
    conversation = system.get_messages("O005", "O007")
    
    for msg in conversation["messages"]:
        sender_id = msg["sender_id"]
        sender_name = system.get_user_info(sender_id)["name"]
        print(f"\n{sender_name}: {msg['text']}")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 5: Conversation Report")
    print("=" * 80)
    
    # Scenario 5: Generate a conversation report for Li Wei and John Smith
    print("\nGenerating conversation report for Li Wei (O001) and John Smith (I001)...")
    
    # Generate and save the report
    report_file = "clean_conversation_report.txt"
    report = system.generate_conversation_report("O001", "I001", report_file)
    
    print(f"\nConversation report generated and saved to {report_file}")
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
