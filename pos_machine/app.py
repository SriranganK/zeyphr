from flask import Flask, jsonify
from flask_cors import CORS
from py532lib.mifare import Mifare, MIFARE_FACTORY_KEY
from flask import send_from_directory, request
import os

BUILD_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')
# app = Flask(__name__)
app = Flask(__name__, static_folder=BUILD_DIR, static_url_path='')

CORS(app, resources={r"/": {"origins": ""}}, supports_credentials=True)  # Enable CORS for all routes

# Initialize card instance
card = Mifare()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    file_path = os.path.join(BUILD_DIR, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(BUILD_DIR, path)
    else:
        return send_from_directory(BUILD_DIR, 'index.html')  # For Vite's SPA routing

@app.route('/api/read-card', methods=['GET'])
def read_card():
    card.SAMconfigure()
    card.set_max_retries(5)
    uid = card.scan_field(wait_time=60)
    print("posmachine@Zepyhr--> Tap your Card")
    try:
        if uid:
            # print(f"Card detected: UID = {uid.hex()}")

            # Sector 1, Block 0 and Block 1
            addresses = [
                card.mifare_address(1, 0),
                card.mifare_address(1, 1),
            ]

            full_data = b""

            for address in addresses:
                try:
                    card.mifare_auth_a(address, MIFARE_FACTORY_KEY)
                    data = card.mifare_read(address)
                    full_data += data
                except Exception as e:
                    print(f"Failed to read block {address}: {e}")
                    return {"status": "read_error", "error": str(e)}

            # Convert full binary data to hex string
            hex_output = '0x' + full_data.hex()
            print({"pub_key": hex_output, "status": "card_detected"})
            return jsonify({"pub_key": hex_output, "status": "card_detected"})

        else:
            return jsonify({"status": "no_card_detected"})
    except Exception as e:
        print("Exception in read_card:", e)
        return jsonify({"status": "no_card_detected"})


# def read_nfc_card():
#     print("posmachine@Zepyhr--> Tap your Card")
#     result = read_card()
#     print("Card Value:", result)
#     return jsonify(result)

@app.route('/api/newtransaction', methods=['POST'])
def handle_newtransaction():
    data = request.get_json()
    print("Data from frontend:", data)
    return jsonify({'status': 'success', 'message': 'Transaction Completed'}), 200

if __name__ == '__main__':
    app.run(port=6442,debug=True)
   

