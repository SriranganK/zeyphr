import os
from flask import Flask, jsonify
from flask_cors import CORS
from py532lib.mifare import Mifare, MIFARE_FACTORY_KEY
from flask import send_from_directory, request


BUILD_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')

app = Flask(__name__, static_folder=BUILD_DIR, static_url_path='')
CORS(app, resources={r"/": {"origins": ""}}, supports_credentials=True)  # Enable CORS for all routes

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    print(f"[Serve React] Path requested: {path}")
    file_path = os.path.join(BUILD_DIR, path)
    if path != "" and os.path.exists(file_path):
        print(f"[Serve React] Serving file: {file_path}")
        return send_from_directory(BUILD_DIR, path)
    else:
        print("[Serve React] Serving index.html for SPA routing")
        return send_from_directory(BUILD_DIR, 'index.html')


card = Mifare()

@app.route('/api/read-card', methods=['GET'])
def read_card_route():
    print("[Read Card] Endpoint hit")
    try:
        card.SAMconfigure()
        card.set_max_retries(5)
        print("posmachine@Zeyphr --> Tap your Card")
        uid = card.scan_field(wait_time=60)

        if uid:
            print(f"[Read Card] Card detected: UID = {uid.hex()}")

            # Sector 14, Block 0 and Block 1 (addresses 56 and 57)
            addresses = [
                card.mifare_address(14, 0),
                card.mifare_address(14, 1),
            ]

            full_data = b""

            for address in addresses:
                try:
                    card.mifare_auth_a(address, MIFARE_FACTORY_KEY)
                    data = card.mifare_read(address)
                    full_data += data
                    # print(f"[Read Card] Read Block {address}: {data.hex()}")
                except Exception as e:
                    print(f"[Read Card] Failed to read block {address}: {e}")
                    return jsonify({"status": "read_error", "error": str(e)}), 500

            # Convert full binary data to hex string (without padding)
            hex_output = '0x' + full_data.rstrip(b'\x00').hex()
            response = {
                "pub_key": hex_output,
                "status": "card_detected"
            }
            print(f"[Read Card] Response: {response}")
            return jsonify(response), 200

        else:
            print("[Read Card] No card detected.")
            return jsonify({"status": "no_card_detected"}), 500

    except Exception as e:
        print(f"[Read Card] Exception occurred: {e}")
        return jsonify({"status": "read_error", "error": str(e)}), 500


if __name__ == '__main__':
    print("[Server] Starting Flask app on port 6442...")
    app.run(port=6442, debug=True)
