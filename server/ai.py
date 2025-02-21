import os
import json
from dotenv import load_dotenv
from openai import OpenAI, AsyncOpenAI
from sequence import get_sequence
from utils.format_message_list import format_messages
from sequence import create_sequence, update_sequence


# Load env variables, i.e. API key
load_dotenv()

# Creates a new assistant
async_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # sync client for testing

assistant_id = "asst_qgvWGy0bnKkfFcLuWATyfmZ1"  # Hardcoded assistant id


# Creates a new thread, returns thread_id
def create_thread():
    thread = client.beta.threads.create()  # sync
    print(f"CREATED THREAD: {thread.id}")
    return thread


# Adds a message to a thread
def add_thread_message(thread_id, role, content):
    try:
        print("ADDING MESSAGE TO THREAD", thread_id, role, content)
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


# Initiates a run on this thread and handles polling. Retrieves the sequence by thread_id and includes it as additional_instructions
def do_run(thread_id):
    print('STARTING RUN')
    sequence = get_sequence(thread_id)
    print('SEQUENCE:')
    print(sequence)
    currentSequence = {
        "id": sequence.id,
        "steps": sequence.steps,
    } if sequence else None
    try:
        response = client.beta.threads.runs.create_and_poll(
            thread_id=thread_id,
            assistant_id=assistant_id,
            poll_interval_ms=2000,
            additional_instructions=f'''
            This is the current sequence: {currentSequence}''',
        )
        print('RUN RESPONSE')
        print(response.id)
        print(response.status)

        # RUN STATUS: REQUIRES ACTION
        if response.status == 'requires_action':
            # Handle the function call
            for tool_call in response.required_action.submit_tool_outputs.tool_calls:
                print('TOOL CALL')
                print(tool_call.function)
                if (
                    tool_call.function.name == "create_sequence"
                ):  # name of your function call
                    print('REQUESTED CREATE_SEQUENCE TOOL CALL')

                    # Arguments returned by llm
                    rawArguments = tool_call.function.arguments

                    # response from function calling
                    try:
                        arguments = json.loads(rawArguments)

                        sequence = create_sequence(
                            room=thread_id, steps=arguments["steps"]
                        )
                        print("CREATE SEQUENCE OUTPUT:")
                        print(f"sequence id: {sequence.id}")
                        print(F"sequence steps: {sequence.steps}")

                        # tool_output = output["response"]

                    except json.JSONDecodeError as e:
                        sequence = "JSONDecodeError: " + str(e), 400
                    except KeyError as e:
                        sequence = "Missing required argument: {e}", 400
                    finally:
                        print(
                            f"JSON DUMP sequence: {json.dumps({"id": sequence.id, "steps": sequence.steps})}"
                        )
                        # Send the response back to the function calling tool
                        response = client.beta.threads.runs.submit_tool_outputs(
                            thread_id=response.thread_id,
                            run_id=response.id,
                            tool_outputs=[
                                {
                                    "tool_call_id": tool_call.id,
                                    "output": json.dumps(
                                        {"id": sequence.id, "steps": sequence.steps}
                                    ),
                                }
                            ],
                        )

    except Exception as e:
        print(f"Error initiating run: {str(e)}")
        return None
