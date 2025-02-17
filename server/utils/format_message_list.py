from openai.types.beta.threads.message import Message


def format_messages(messages: list[Message]) -> list[dict]:
    if not messages:
        return []

    formatted_messages = []
    for message in messages:
        content_text = ""
        for content_block in message.content:
            if content_block.type == "text":
                content_text += content_block.text.value  # Extract the text
            # Handle other content types if needed (e.g., images)
        formatted_messages.append({
            "role": message.role, "content": content_text})
    return formatted_messages