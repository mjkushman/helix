from openai import OpenAI
import os
from dotenv import load_dotenv


# Load env variables, i.e. API key
load_dotenv()

# Creates a new assistant
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def create_assistant():
    try:
        response = openai_client.beta.assistants.create(
            name="My AI Assistant",
            instructions=
                '''You're a veteran talent recruiter. Help the user create a sequence of outreach messages.
                We'll be working with a Sequence object. You have tools to 
                1) Generate a new sequence entirely
                2) Add, modify, or delete a step in an existing sequence''',
            # tools=[{"type": "code_interpreter"}],  # Example tool, customize as needed
            model="gpt-4o-mini"
        )
        return response.id  # Return assistant ID   
    except Exception as e:
        print(f"Error creating assistant: {str(e)}")
        return None

def delete_assistant(assistant_id):
    try:
        response = openai_client.Assistant.delete(assistant_id)
        print(f"Assistant {assistant_id} deleted successfully.")
        return response
    except Exception as e:
        print(f"Error deleting assistant: {str(e)}")
        return None