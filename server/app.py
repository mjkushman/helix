from flask import Flask, request
from flask_socketio import SocketIO, emit

from dotenv import load_dotenv
from ai import create_assistant, delete_assistant

app = Flask(__name__)

# app.config['SECRET_KEY'] = '123'
io = SocketIO(app, cors_allowed_origins="http://localhost:5173")

@app.route("/")
def index():
    return "SocketIO server is running."




# Handle connect event
@io.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

    # try:
    #     assistant_id = create_assistant()
    #     print(f"assistant created. id: {assistant_id} ")
    # except Exception as e:
    #     print(f"Error creating assistant: {str(e)}")


# Handle message event
@io.on('message')
def handle_message(data):
    message, sequence = data.values()
    print(f"Message received: {message}")
    print(f"Sequence received: {sequence}")
    emit('message', message) # Send the message back for display


# Handle disconnect event
@io.on('disconnect')
def handle_disconnect():
    delete_assistant()
    print(f"Client disconnected: {request.sid}")


if __name__ == '__main__':
    io.run(app, host='0.0.0.0', port=5000, debug=True)