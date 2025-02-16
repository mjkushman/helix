from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)

app.config['SECRET_KEY'] = '123'
io = SocketIO(app, cors_allowed_origins="http://localhost:5173")

@app.route("/")
def index():
    return "SocketIO server is running."

# Handle connect event
@io.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

# Handle message event
@io.on('message')
def handle_message(data):
    print(f"Message received: {data}")
    emit('message', data, broadcast=True)

# Handle disconnect event
@io.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")



if __name__ == '__main__':
    io.run(app, host='0.0.0.0', port=5000, debug=True)