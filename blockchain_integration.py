from web3 import Web3
import json

# Connect to Ganache CLI
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

# Check connection
if not web3.is_connected():  # Updated method name
    raise Exception("Failed to connect to Ethereum blockchain.")

# Set default account (use Ganache’s first account)
web3.eth.default_account = web3.eth.accounts[0]  # Should match Ganache output

# Load contract ABI and address
contract_address = "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B"  # Replace with your actual FileStorage address
with open("FileStorageABI.json", "r") as f:
    contract_abi = json.load(f)

# Create contract instance
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Add file metadata to the blockchain
def add_file_to_blockchain(file_hash, user_id):
    try:
        tx_hash = contract.functions.addFile(file_hash, user_id).transact({
            "from": web3.eth.default_account,
            "gas": 200000  # Set a reasonable gas limit
        })
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"File added to blockchain. Transaction hash: {tx_hash.hex()}")
        return receipt
    except Exception as e:
        print(f"Error adding file to blockchain: {e}")
        return None

# Retrieve file metadata from the blockchain
def get_file_from_blockchain(file_id):
    try:
        file_hash, timestamp, user_id = contract.functions.getFile(file_id).call()
        print(f"File ID: {file_id}")
        print(f"File Hash: {file_hash}")
        print(f"Timestamp: {timestamp}")
        print(f"User ID: {user_id}")
        return file_hash, timestamp, user_id
    except Exception as e:
        print(f"Error retrieving file from blockchain: {e}")
        return None

# Verify file integrity
def verify_file_integrity(file_id, current_file_hash):
    try:
        stored_file_hash, _, _ = contract.functions.getFile(file_id).call()
        if stored_file_hash == current_file_hash:
            print("File integrity verified: Hashes match.")
            return True
        else:
            print("File integrity compromised: Hashes do not match.")
            return False
    except Exception as e:
        print(f"Error verifying file integrity: {e}")
        return False

# Example usage
if __name__ == "__main__":
    # Add file metadata
    file_hash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    user_id = "user123"
    add_file_to_blockchain(file_hash, user_id)

    # Retrieve file metadata
    file_id = 0
    get_file_from_blockchain(file_id)

    # Verify file integrity
    current_file_hash = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    verify_file_integrity(file_id, current_file_hash)