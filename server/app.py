from flask import Flask, request, session, redirect, url_for

# from flask_session import Session
from flask_socketio import SocketIO, emit, join_room, send
from sequence import create_sequence, get_sequence
from dotenv import load_dotenv
from ai import (
    create_thread,
    add_thread_message,
    fetch_thread_messages,
    do_run,
)


app = Flask(__name__)
app.config["SECRET_KEY"] = "unguessable_key"

load_dotenv()

# app.config['SECRET_KEY'] = '123'
io = SocketIO(app, cors_allowed_origins="http://localhost:5173", logger=True)

rooms = {}

# Home route should create a new thread and room, then redirect the user to that room's route
@app.route("/")
def index():
    room = session.get("room")
    print(f'got room {room}')
    if room:
        print(f"thread already exists. Redirecting to {session["room"]}")
        return redirect(url_for("room", room=room))
    
    else:
        thread = create_thread()
        room = thread.id
        session["room"] = thread.id  # Store the thread id in session
        session["thread"] = thread.id  # Store the thread id in session again.
        print(f"New thread created. Redirecting to {room}")
        return redirect(url_for("room", room=room))

    # return "SocketIO server is running."


@app.route("/<room>")
def room(room):
    
    return f"room route: {room}"


# Handle connect event
@io.on('connect')
def handle_connect():
    thread_id = request.args.get('thread', None)

    print(f"Thread id on connect: {thread_id}")

    if thread_id:
        join_room(thread_id)
        print(f"Existing id provided: {thread_id}")
        print(f"Client reconnected to thread: {thread_id}")
    else:
        print("No thread id providedm, creating...")
        # thread = create_thread()
        # thread_id = thread.id
        thread_id = "mythread"

        join_room(thread_id)
        emit('thread_id', {'thread': thread_id})


@io.on('join')
def handle_join(data):
    print(f"joined room. data: {data})")


# Handle message event
@io.on('message')
def handle_message(data):
    message, sequence = data.values()
    content, role = message.values()
    #  Send the user's message back to the thread
    emit('message', {"role": role, "content": content}, broadcast=True)
    #  Send a messag back immediately to acknowledge receipt
    emit('message', {"role": "assistant", "content": "Working..."}, broadcast=True)
    sid = request.sid
    thread_id = request.args.get('t')

    thread = session.get(thread_id)

    print(f"Message received: {message}, sending to thread: {thread_id}")
    print(f"Sequence received: {sequence}")

    # Add the message to the thread
    add_thread_message(thread_id, "user", content)

    # Trigger a run
    do_run(thread_id)

    #  get the updated sequence from db and emit back to client
    sequence = get_sequence(thread_id)
    print(f"getted sequence: {sequence}")
    emit('sequence_update', sequence, broadcast=True)

    # emit back the entire thread
    thread_messages = fetch_thread_messages(thread_id)
    emit('thread_messages', thread_messages, broadcast=True)


# Handle disconnect event
@io.on('disconnect')
def handle_disconnect():
    sid = request.sid
    print(f"Client disconnected: {sid}")


if __name__ == '__main__':
    io.run(app, host='0.0.0.0', port=5000, debug=True)
