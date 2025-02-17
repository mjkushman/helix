import os
from dotenv import load_dotenv
from openai import OpenAI

from utils.format_message_list import format_messages


# Load env variables, i.e. API key
load_dotenv()

# Creates a new assistant
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def create_assistant():
    try:
        response = client.beta.assistants.create(
            name="My AI Assistant",
            instructions='''You're a veteran talent recruiter. Help the user create a sequence of outreach messages.
                We'll be working with a Sequence object. You have tools to 
                1) Generate a new sequence entirely
                2) Add, modify, or delete a step in an existing sequence''',
            # tools=[{"type": "code_interpreter"}],  # Example tool, customize as needed
            model="gpt-4o-mini",
        )
        return response.id  # Return assistant ID
    except Exception as e:
        print(f"Error creating assistant: {str(e)}")
        return None


def fetch_assistant(assistant_id="asst_qgvWGy0bnKkfFcLuWATyfmZ1"):
    try:
        response = client.beta.assistants.retrieve(assistant_id)

    except Exception as e:
        print(f"Error fetching assistant: {str(e)}")
        return None
    return response.id


def delete_assistant(assistant_id):
    try:
        response = client.Assistant.delete(assistant_id)
        print(f"Assistant {assistant_id} deleted successfully.")
        return response
    except Exception as e:
        print(f"Error deleting assistant: {str(e)}")
        return None


# Creates a new thread, returns thread_id
def create_thread():
    thread = client.beta.threads.create()
    print(f"CREATED THREAD: {thread}")
    return thread


# Adds a message to a thread
def add_thread_message(thread_id, role, content):
    try:
        print("ADDING MESSAGE TO THREAD")
        client.beta.threads.messages.create(thread_id, role=role, content=content)
    except Exception as e:
        print(f"Error adding message to thread: {str(e)}")
        return None


# Fetches the thead messages
def fetch_thread_messages(thread_id):
    try:
        response = client.beta.threads.messages.list(thread_id, order="asc")
        print(response.data)
        formatted_list = format_messages(response.data)
        print("THREAD MESSAGES")
        print(formatted_list)
        return formatted_list
    except Exception as e:
        print(f"Error fetching thread messages: {str(e)}")
        return None


# Initiates a run on this thread and handles polling
async def init_run(thread_id, assistant_id):
    try:
        response = await client.beta.threads.runs.create_and_poll(
            thread_id=thread_id, assistant_id=assistant_id, poll_interval_ms=2000
        )

        # TODO
        # RUN STATUS: REQUIRES ACTION
        if run.status == 'requires_action':
            # Handle the function call
            for tool_call in run.required_action.submit_tool_outputs.tool_calls:
                if tool_call.function.name == "12345":  # name of your function call

                    # Arguments returned by llm
                    rawArguments = tool_call.function.arguments

                    # response from function calling
                    response_message = ""
                    try:
                        arguments = json.loads(rawArguments)

                        output = await function_to_be_called(
                            arguments["firstname"], arguments['phone']
                        )
                        response_message = output["response"]

                    except json.JSONDecodeError as e:
                        response_message = "JSONDecodeError: " + str(e), 400
                    except KeyError as e:
                        response_message = "Missing required argument: {e}", 400
                    finally:

                        # Send the response back to the function calling tool
                        run = await client.beta.threads.runs.submit_tool_outputs(
                            thread_id=run.thread_id,
                            run_id=run.id,
                            tool_outputs=[
                                {
                                    "tool_call_id": tool_call.id,
                                    "output": response_message,  # pass the response from your function to openai, so it knows if everything worked fine, or happens with me a lot, some arguments was invalid or filled with a placeholder.
                                }
                            ],
                        )

    except Exception as e:
        print(f"Error initiating run: {str(e)}")
        return None
