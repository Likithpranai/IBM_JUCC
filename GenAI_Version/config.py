import os
from dotenv import load_dotenv

# Load environment variables from .env.local file
load_dotenv('.env.local')

WATSON_API_KEY = os.environ.get("WATSON_API_KEY")
WATSON_API_URL = os.environ.get("WATSON_API_URL", "https://us-south.ml.cloud.ibm.com")
WATSON_PLATFORM_URL = os.environ.get("WATSON_PLATFORM_URL", "https://api.dataplatform.cloud.ibm.com")
WATSON_PROJECT_ID = os.environ.get("WATSON_PROJECT_ID")
