from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
from flask_socketio import SocketIO, emit, join_room
from sequence import create_sequence, get_sequence, update_sequence
from dotenv import load_dotenv
from ai import (
    create_thread,
    add_thread_message,
    fetch_thread_messages,
    do_run,
)


app = Flask(__name__)
app.config["SECRET_KEY"] = "unguessable_key"
cors = CORS(app)  # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

load_dotenv()

# app.config['SECRET_KEY'] = '123'
io = SocketIO(app, cors_allowed_origins="http://localhost:5173", logger=False)

rooms = {}


# Home route should create a new thread and room,
# then redirect the user to that room's route
@app.route("/", methods=["POST"])
def index():
    room = session.get("room")
    print(f'got room {room}')
    if room:
        return jsonify(room)
    else:
        # Create a new thread on openai
        thread = create_thread()
        room = thread.id  # the room is the thread id
        rooms[room] = {"members": 0}
        session["room"] = room  # Store the thread id in session
        session["thread"] = room  # Store the thread id in session again.
        # Return the room aka thread id
        return jsonify({"room": room}), 201


@app.route("/sequence/<thread_id>", methods=["GET"])
def handle_sequence(thread_id):
    if request.method == "GET":
        sequence = get_sequence(thread_id)
        if sequence:
            return jsonify({"id": sequence.id, "steps": sequence.steps})
        else:
            return jsonify()
    else:
        return jsonify({"error": "Invalid request method"}), 405


@app.route("/sequence/<int:id>", methods=["PATCH"])
def handle_update_sequence(id):
    if request.method == "PATCH":
        print("PATCH request received")
        # update an existing sequence
        json_data = request.get_json()
        steps = json_data["steps"]
        sequence = update_sequence(id, steps)
        print("updated", sequence.id, sequence.steps)
        return jsonify({"id": sequence.id, "steps": sequence.steps}), 201
    else:
        return jsonify({"error": "Invalid request method"}), 405


@app.route("/sequence", methods=["POST"])
def handle_create_sequence():
    if request.method == "POST":
        print("POST request received")
        # Create a new sequence
        json_data = request.get_json()
        thread_id = json_data["thread_id"]
        sequence = create_sequence(thread_id)
        print("created", sequence.id, sequence.steps)
        return jsonify({"id": sequence.id, "steps": sequence.steps}), 201
    else:
        return jsonify({"error": "Invalid request method"}), 405


# Gets the messages in a thread
@app.route("/thread/<thread_id>", methods=["GET"])
def handle_thread(thread_id):
    if request.method == "GET":
        thread_messages = fetch_thread_messages(thread_id)
        return jsonify(thread_messages)

    else:
        return jsonify({"error": "Invalid request method"}), 405


# Handle connect event
@io.on('connect')
def handle_connect(auth):

    room = auth['room']
    session['room'] = room

    print(f"room id on connect: {room}")
    if not rooms.get(room):
        emit('refused', {"message": "invalid room"})
        return False

    print(f"Existing id provided: {room}")
    print(f"Client reconnected to thread: {room}")
    join_room(room)


# Handle message event
@io.on('message')
def handle_message(data):
    print(f"room on message: {data}")
    # message = data.values()
    content, role = data.values()
    room = session.get("room")
    thread_id = room

    #  Send the user's message back to the thread
    emit('message', {"role": role, "content": content}, to=room)
    #  Send a message back immediately to acknowledge receipt
    emit('message', {"role": "assistant", "content": "Working..."}, to=room)

    # Add the message to the thread
    add_thread_message(thread_id, "user", content)

    # Trigger a run
    do_run(thread_id)

    # emit back the entire thread
    thread_messages = fetch_thread_messages(thread_id)
    emit('thread_update', thread_messages, to=thread_id)


# Handle disconnect event
@io.on('disconnect')
def handle_disconnect():
    sid = request.sid
    print(f"Client disconnected: {sid}")


if __name__ == '__main__':
    io.run(app, host='0.0.0.0', port=5000, debug=True)
