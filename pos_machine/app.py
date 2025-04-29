import os
from flask import Flask, jsonify
from flask_cors import CORS
from py532lib.mifare import Mifare, MIFARE_FACTORY_KEY
from flask import send_from_directory, request
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


BUILD_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')

app = Flask(__name__, static_folder=BUILD_DIR, static_url_path='')

CORS(app, resources={r"/": {"origins": ""}}, supports_credentials=True)  # Enable CORS for all routes

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    file_path = os.path.join(BUILD_DIR, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(BUILD_DIR, path)
    else:
        return send_from_directory(BUILD_DIR, 'index.html')  # For Vite's SPA routing



# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

def decrypt_hex(encrypted_hex, key):
    iv = bytes.fromhex(encrypted_hex[:32])  # First 32 hex characters = IV (16 bytes)
    encrypted_data = bytes.fromhex(encrypted_hex[32:])  # Rest is encrypted data

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    decrypted_padded = decryptor.update(encrypted_data) + decryptor.finalize()
    decrypted = decrypted_padded.rstrip(b'\x00')  # Remove padding

    return decrypted.hex()  # Convert back to hex

# Initialize card instance
card = Mifare()



@app.route('/api/read-card', methods=['GET'])
def read_card():
    try:
        card.SAMconfigure()
        card.set_max_retries(5)
        print("posmachine@Zepyhr --> Tap your Card")

        uid = card.scan_field(wait_time=60)

        if not uid:
            print("No card detected.")
            return jsonify({"status": "no_card_detected"}) , 500
        else:
            print(f"Card detected: UID = {uid.hex()}")

            block_map = [
                (1, 0), (1, 1), (1, 2),
                (2, 0), (2, 1), (2, 2),
            ]

            all_blocks = []

            for sector, block in block_map:
                address = card.mifare_address(sector, block)
                try:
                    card.mifare_auth_a(address, MIFARE_FACTORY_KEY)
                    data = card.mifare_read(address)
                    
                    all_blocks.append(data)
                except Exception as e:
                    print(f"Failed to read Sector {sector}, Block {block}: {e}")
                    return

            # Join all blocks
            full_data = b"".join(all_blocks)

            pubkey_bin = full_data[:20]
            encrypted_privkey_bin = full_data[32:96]  # Start after block 1/1 (includes padding)

            aes_key = b''
            return jsonify({
                "pub_key": "0x" + pubkey_bin.hex(),
                "priv_key": decrypt_hex(encrypted_privkey_bin.hex(),aes_key),
                "status": "card_detected"
            }), 200
           
    except Exception as e:
        print("Exception in read_card:", e)
        return jsonify({"status": "no_card_detected"}), 500



@app.route('/api/newtransaction', methods=['POST'])
def handle_newtransaction():
    data = request.get_json()
    print("Data from CARD Posting to Main server :", data)
    return jsonify({'status': 'success', 'message': 'Transaction Completed'}), 200


if __name__ == '__main__':
    app.run(port=6442,debug=True)
   

