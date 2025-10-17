# Exchange Program Connection System

This system facilitates connections between exchange students, alumni, and past exchange participants to enhance the exchange experience through networking and knowledge sharing.

## 🚀 NEW: GenAI-Enhanced Connection System

The system now includes IBM WatsonX integration for enhanced connection features:

- **Smart Compatibility Analysis**: Uses GenAI to analyze student profiles and provide personalized compatibility scores
- **Intelligent Conversation Starters**: Generates tailored conversation prompts based on shared interests and backgrounds
- **Personalized Area Guides**: Creates custom guides for exchange destinations based on student interests
- **Enhanced Matching**: Improves connection quality through deep semantic understanding

## Overview

The Exchange Program Connection System provides four main types of connections and a messaging system:

1. **Direct Exchange Partner Matching**
   - Connects HKUST students going abroad with students from partner universities coming to HKUST
   - Matches are based on the exchange period and interest similarity
   - Helps students establish connections before their exchange begins

2. **Alumni Network Connection**
   - Connects outgoing exchange students with HKUST alumni living in their destination country
   - Prioritizes alumni working at the destination university
   - Matches are based on location and interest similarity
   - Provides valuable local insights and potential mentorship

3. **Previous Exchange Student Connection**
   - Connects outgoing students with HKUST students who previously attended the same exchange university
   - Matches are based on experience ratings and major similarity
   - Provides specific advice about the university, courses, and local environment

4. **Area-Based Connection**
   - Connects HKUST students going to the same geographical area (e.g., Greater Boston, San Francisco Bay Area)
   - Matches students even if they're attending different universities in the same region
   - Facilitates local networking, potential housing sharing, and joint exploration
   - Helps create a local HKUST community in each exchange destination

5. **Messaging and Contact Sharing**
   - Enables direct communication between connected students, alumni, and past participants
   - Allows users to share contact information with others in their network
   - Tracks conversations and provides conversation reports
   - Facilitates group discussions and community building

## Features

- Interest-based matching algorithm to find the most compatible connections
- Comprehensive connection reports for each student
- Fuzzy matching for interest comparison
- Multiple connection types to provide a holistic support network

## Usage

### Running the Demo

```bash
# For the main connection system demo
python connection_demo.py

# For the area-based connection system demo
python area_connection_demo.py

# For the messaging and contact sharing demo
python messaging_demo.py

# For the GenAI-enhanced connection system demo
python genai_enhanced_demo.py
```

### Using the Connection System in Your Code

```python
# Main connection system
from connection_system import ConnectionSystem

# Initialize the system
system = ConnectionSystem()

# Find an exchange partner
partner_result = system.find_exchange_partner("O001")

# Find alumni connections
alumni_result = system.find_alumni_connections("O002")

# Find past exchange students
past_result = system.find_past_exchange_students("O003")

# Generate a complete connection report
report = system.generate_connection_report("O005", "connection_report.txt")

# Area-based connection system
from area_connection import AreaConnectionSystem

# Initialize the area system
area_system = AreaConnectionSystem()

# Find students in the same area
area_result = area_system.find_area_connections("O005")

# Generate an area connection report
area_report = area_system.generate_area_connection_report("O005", "area_connection_report.txt")

# Messaging and contact sharing system
from messaging_system import MessagingSystem

# Initialize the messaging system
msg_system = MessagingSystem()

# Send a message
msg_result = msg_system.send_message("O001", "I001", "Hello! Looking forward to our exchange.")

# Get conversation history
conversation = msg_system.get_messages("O001", "I001")

# Share a contact with another user
share_result = msg_system.share_contact("O001", "A001", "O002")

# Generate a conversation report
conv_report = msg_system.generate_conversation_report("O001", "I001", "conversation_report.txt")

# GenAI-enhanced connection system
from genai_enhanced_connection import GenAIEnhancedConnectionSystem

# Initialize the GenAI-enhanced system
genai_system = GenAIEnhancedConnectionSystem()

# Find exchange partner with GenAI compatibility analysis
enhanced_partner = genai_system.find_exchange_partner("O001")

# Get area connections with personalized area guide
enhanced_area = genai_system.find_area_connections("O005")

# Generate a comprehensive GenAI-enhanced report
enhanced_report = genai_system.generate_enhanced_connection_report("O003", "genai_report.txt")
```

## Sample Data

The system includes sample data for demonstration purposes:

- 5 outgoing HKUST students
- 5 incoming exchange students
- 5 HKUST alumni living abroad
- 5 past exchange students

In a production environment, this data would be replaced with a database connection to real student records.

## Integration with University Matcher

This connection system is designed to work after a student has selected their exchange university using the University Matcher system. The typical workflow is:

1. Student uses the University Matcher to find suitable exchange universities
2. Student selects their preferred university
3. Connection System identifies relevant contacts for the selected university
4. Student connects with exchange partners, alumni, and past participants

## Benefits

- Reduces anxiety about going on exchange by providing connections
- Creates a support network for students before, during, and after exchange
- Facilitates knowledge transfer between current and past exchange participants
- Strengthens the HKUST global community through meaningful connections
