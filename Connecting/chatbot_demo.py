#!/usr/bin/env python3
"""
Demo script for the GenAI Chatbot Connector
"""
from genai_chatbot_connector import GenAIChatbotConnector

def run_demo():
    """Run a demonstration of the GenAI chatbot connector"""
    print("=" * 80)
    print("GENAI CHATBOT CONNECTOR DEMO")
    print("=" * 80)
    
    # Initialize the GenAI chatbot connector
    print("\nInitializing GenAI chatbot connector...")
    connector = GenAIChatbotConnector()
    
    # Display available connections for demo
    print("\nAvailable Connections for Demo:")
    print("\nOutgoing Students:")
    print("  ID: O001 - Li Wei going to University of British Columbia")
    print("  ID: O003 - Raj Patel going to MIT")
    print("  ID: O005 - Michael Wong going to Stanford University")
    
    print("\nIncoming Students:")
    print("  ID: I001 - John Smith coming from University of British Columbia")
    print("  ID: I003 - David Kim coming from MIT")
    
    print("\nAlumni:")
    print("  ID: A001 - Dr. James Wong at University of British Columbia")
    print("  ID: A002 - Emily Chan at HSBC")
    
    # Demo scenarios
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 1: Direct Connection Information")
    print("=" * 80)
    
    # Scenario 1: Get direct connection information for Li Wei and John Smith
    print("\nGetting direct connection information for Li Wei (O001) and John Smith (I001)...")
    connection_info = connector.get_direct_connection_info("O001", "I001")
    
    print("\nConnection Information:")
    print(f"Student: {connection_info['student']['name']}")
    print(f"  Email: {connection_info['student']['email']}")
    print(f"  Phone: {connection_info['student']['phone']}")
    print(f"  WeChat: {connection_info['student']['wechat']}")
    print(f"  WhatsApp: {connection_info['student']['whatsapp']}")
    
    print(f"\nConnection: {connection_info['connection']['name']}")
    print(f"  Email: {connection_info['connection']['email']}")
    print(f"  Phone: {connection_info['connection']['phone']}")
    print(f"  WeChat: {connection_info['connection']['wechat']}")
    print(f"  WhatsApp: {connection_info['connection']['whatsapp']}")
    
    print(f"\nChat ID: {connection_info['chat_id']}")
    print(f"Chat URL: {connection_info['chat_url']}")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 2: Chat Messaging with GenAI Response Suggestions")
    print("=" * 80)
    
    # Scenario 2: Chat messaging between Li Wei and John Smith
    print("\nSimulating chat between Li Wei (O001) and John Smith (I001)...")
    
    # Li Wei sends a message
    message1 = connector.send_chat_message(
        connection_info['chat_id'], "O001", 
        "Hi John! I'm Li Wei from HKUST. I'll be coming to UBC next semester while you'll be at HKUST. I thought it would be great to connect since we're part of the same exchange program!"
    )
    
    print("\nLi Wei: Hi John! I'm Li Wei from HKUST. I'll be coming to UBC next semester while you'll be at HKUST. I thought it would be great to connect since we're part of the same exchange program!")
    
    if message1.get("response_suggestion"):
        print("\nGenAI Response Suggestion for John:")
        print(f"  \"{message1['response_suggestion']}\"")
    
    # John Smith replies
    message2 = connector.send_chat_message(
        connection_info['chat_id'], "I001", 
        "Hello Li Wei! Great to hear from you. Yes, I'm excited to be going to HKUST while you'll be at my home university UBC. Do you have any questions about Vancouver or UBC that I could help with?"
    )
    
    print("\nJohn Smith: Hello Li Wei! Great to hear from you. Yes, I'm excited to be going to HKUST while you'll be at my home university UBC. Do you have any questions about Vancouver or UBC that I could help with?")
    
    if message2.get("response_suggestion"):
        print("\nGenAI Response Suggestion for Li Wei:")
        print(f"  \"{message2['response_suggestion']}\"")
    
    # Li Wei responds
    message3 = connector.send_chat_message(
        connection_info['chat_id'], "O001", 
        "Yes, I'd love to know more about housing options near UBC. Are there any student residences you'd recommend? Also, what's the weather like in Vancouver during the winter?"
    )
    
    print("\nLi Wei: Yes, I'd love to know more about housing options near UBC. Are there any student residences you'd recommend? Also, what's the weather like in Vancouver during the winter?")
    
    if message3.get("response_suggestion"):
        print("\nGenAI Response Suggestion for John:")
        print(f"  \"{message3['response_suggestion']}\"")
    
    # Get chat history
    print("\nRetrieving chat history...")
    chat_history = connector.get_chat_history(connection_info['chat_id'])
    
    print(f"\nChat History for {connection_info['chat_id']}:")
    print(f"Participants: {', '.join(chat_history['participants'])}")
    print(f"Messages: {len(chat_history['messages'])}")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 3: Connection Card Generation")
    print("=" * 80)
    
    # Scenario 3: Generate a connection card for Raj Patel and David Kim
    print("\nGenerating connection card for Raj Patel (O003) and David Kim (I003)...")
    
    connection_card = connector.generate_connection_card("O003", "I003")
    
    print("\nConnection Card HTML Preview:")
    print("-" * 40)
    preview_lines = connection_card.split('\n')[:15]
    print('\n'.join(preview_lines))
    print("...")
    
    print("\n" + "=" * 80)
    print("DEMO SCENARIO 4: Connection Report Generation")
    print("=" * 80)
    
    # Scenario 4: Generate a connection report for Michael Wong
    print("\nGenerating connection report for Michael Wong (O005)...")
    
    # Generate and save the report
    report_file = "direct_connection_report.txt"
    report = connector.generate_connection_report(
        "O005", ["I005", "O007", "A005"], report_file
    )
    
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
