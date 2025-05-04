# Writing only pubkey to nfc card
from py532lib.mifare import Mifare, MIFARE_FACTORY_KEY

# 1. Create an instance of Mifare
card = Mifare()

# 2. Initialize PN532 and scan for a card
card.SAMconfigure()
card.set_max_retries(5)
uid = card.scan_field()

# 3. Proceed if a card is detected
if uid:
    print(f"Card detected: UID = {uid.hex()}")

    # 4. Convert hex string to bytes
    hex_value = "9517dC4f39257cC6B8aa9B4f0455C7c3a991cdD4"
    binary_data = bytes.fromhex(hex_value)

    # Confirm total byte length
    print(f"Data length: {len(binary_data)} bytes")
    assert len(binary_data) <= 32, "Hex data exceeds 32 bytes"

    # Split into 16-byte chunks and pad second chunk if needed
    chunk1 = binary_data[:16]
    chunk2 = binary_data[16:].ljust(16, b'\x00')  # pad to 16 bytes

    # Targeting Sector 14 (Block 0 and 1 → Address 56 and 57)
    addresses = [
        card.mifare_address(14, 0),  # Address 56
        card.mifare_address(14, 1),  # Address 57
    ]

    # Authenticate and write each chunk
    for i, data in enumerate([chunk1, chunk2]):
        address = addresses[i]
        try:
            card.mifare_auth_a(address, MIFARE_FACTORY_KEY)
            card.mifare_write_standard(address, data)
            print(f"Block {address} written successfully.")
        except Exception as e:
            print(f"Failed to write Block {address}: {e}")

else:
    print(" No card found.")
