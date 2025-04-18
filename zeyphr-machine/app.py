from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # Import the CORS module

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in the Flask app
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for Socket.IO

# POST endpoint to receive pubkey and emit to socket
@app.route('/api/nfc', methods=['POST'])
def handle_nfc():
    data = request.get_json()
    pubkey = data.get('pubkey')
    if not pubkey:
        return jsonify({'error': 'pubkey missing'}), 400

    # Emit the public key to all clients listening to "listen-nfc"
    socketio.emit('listen-nfc', {'pubkey': pubkey})

    return jsonify({'status': 'success', 'message': 'Pubkey emitted'}), 200

# POST endpoint to receive pubkey and emit to socket
@app.route('/api/scan', methods=['POST'])
def handle_scan():
    data = request.get_json()
    pubkey = data.get('pubkey')
    if not pubkey:
        return jsonify({'error': 'pubkey missing'}), 400

    # Emit the public key to all clients listening to "listen-scan"
    socketio.emit('listen-scan', {'pubkey': pubkey})

    return jsonify({'status': 'success', 'message': 'Pubkey emitted'}), 200

@app.route('/api/newtransaction', methods=['POST'])
def handle_newtransaction():
    data = request.get_json()

    return jsonify({'status': 'success', 'message': 'Transaction Completed'}), 200

# SocketIO connection test
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)