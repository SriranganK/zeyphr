from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os
from py532lib.mifare import Mifare, MIFARE_FACTORY_KEY

# AES key (32 bytes for AES-256) - 
aes_key = b'' 

def encrypt_hex_cbc(hex_value, key):
    data = bytes.fromhex(hex_value)
    iv = os.urandom(16)

    # Pad with null bytes to 48 bytes (16-byte block size padding)
    padded_data = data + b'\x00' * (16 - len(data) % 16)

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded_data) + encryptor.finalize()

    return (iv + encrypted).hex()  # return full encrypted data (IV + ciphertext)

def write_to_nfc_card(pubkey, privkey_encrypted):
    card = Mifare()
    card.SAMconfigure()
    card.set_max_retries(5)

    uid = card.scan_field()
    if not uid:
        print("No card found.")
        return

    print(f"Card detected: UID = {uid.hex()}")
    print(f"Encrypted privkey: {privkey_encrypted}")

    # Convert values to binary
    binary_pubkey = bytes.fromhex(pubkey)
    binary_privkey = bytes.fromhex(privkey_encrypted)

    assert len(binary_pubkey) == 20, f"Pubkey length is {len(binary_pubkey)}, expected 20 bytes"
    assert len(binary_privkey) == 64, f"Encrypted privkey length is {len(binary_privkey)}, expected 64 bytes"

    # Split pubkey into 16 + 4 (pad to 16)
    pubkey_chunk1 = binary_pubkey[:16]
    pubkey_chunk2 = binary_pubkey[16:].ljust(16, b'\x00')

    # Split encrypted privkey (64 bytes) into 4 chunks
    enc_chunk1 = binary_privkey[:16]
    enc_chunk2 = binary_privkey[16:32]
    enc_chunk3 = binary_privkey[32:48]
    enc_chunk4 = binary_privkey[48:]

    # Sector/block write mapping (avoid block 3 in each sector)
    write_map = [
        (1, 0, pubkey_chunk1),
        (1, 1, pubkey_chunk2),
        (1, 2, enc_chunk1),
        (2, 0, enc_chunk2),
        (2, 1, enc_chunk3),
        (2, 2, enc_chunk4),
    ]

    for sector, block, data in write_map:
        if block == 3:
            print(f"Skipping Sector {sector}, Block {block} bcoz -> (security block)")
            continue

        address = card.mifare_address(sector, block)
        try:
            card.mifare_auth_a(address, MIFARE_FACTORY_KEY)
            card.mifare_write_standard(address, data)
            print(f"Sector {sector}, Block {block} written successfully.")
        except Exception as e:
            print(f"Failed to write Sector {sector}, Block {block}: {e}")

# --- Main ---
if __name__ == "__main__":
    pubkey = "0x9517dC4f39257cC6B8aa9B4f0455C7c3a991cdD4"  # 20 bytes
    privkey = "d6d394608d8f53d8ff6b395170a0bf5c28a9739bf26a4ff40521708b6bcc9c7e"  # 32 bytes

    # Encrypt private key
    encrypted_privkey = encrypt_hex_cbc(privkey, aes_key)

    # Write to card
    write_to_nfc_card(pubkey[2:], encrypted_privkey)  # Strip "0x" from pubkey
