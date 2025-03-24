# from web3 import Web3
# import json
# import requests

# # Connect to Ganache
# ganache_url = "http://127.0.0.1:7545"
# web3 = Web3(Web3.HTTPProvider(ganache_url))
# if not web3.is_connected():
#     raise Exception("Failed to connect to Ethereum blockchain.")
# web3.eth.default_account = web3.eth.accounts[0]

# # Load contract
# contract_address = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"  # Your FileStorage address
# with open("FileStorageABI.json", "r") as f:
#     contract_abi = json.load(f)
# contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# # Upload to IPFS using HTTP API
# def upload_to_ipfs(file_path):
#     try:
#         url = "http://127.0.0.1:5001/api/v0/add"
#         with open(file_path, "rb") as f:
#             files = {"file": f}
#             response = requests.post(url, files=files)
#             response.raise_for_status()
#             file_hash = response.json()["Hash"]
#             print(f"Uploaded to IPFS: {file_hash}")
#             return file_hash
#     except Exception as e:
#         print(f"Error uploading to IPFS: {e}")
#         return None

# # Add to blockchain
# def add_file_to_blockchain(file_hash, user_id):
#     tx_hash = contract.functions.addFile(file_hash, user_id).transact({"from": web3.eth.default_account, "gas": 200000})
#     receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
#     print(f"Added to blockchain. Tx hash: {tx_hash.hex()}")
#     return receipt

# # Example usage
# if __name__ == "__main__":
#     file_path = "test.txt"
#     with open(file_path, "w") as f:
#         f.write("Test file for Blockchain-Integrated-File-System")
#     file_hash = upload_to_ipfs(file_path)
#     if file_hash:
#         add_file_to_blockchain(file_hash, "user123")



from web3 import Web3
import json
import requests

# Connect to Ganache
ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
if not web3.is_connected():
    raise Exception("Failed to connect to Ethereum blockchain.")
web3.eth.default_account = web3.eth.accounts[0]

# Load contract
contract_address = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"  # Replace with your FileStorage address from migration
with open("FileStorageABI.json", "r") as f:
    contract_abi = json.load(f)
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Upload to IPFS
def upload_to_ipfs(file_path):
    url = "http://127.0.0.1:5001/api/v0/add"
    with open(file_path, "rb") as f:
        files = {"file": f}
        response = requests.post(url, files=files)
        response.raise_for_status()
        file_hash = response.json()["Hash"]
        print(f"Uploaded to IPFS: {file_hash}")
        return file_hash

# Add to blockchain
def add_file_to_blockchain(file_hash, user_id):
    tx_hash = contract.functions.addFile(file_hash, user_id).transact({"from": web3.eth.default_account, "gas": 200000})
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Added to blockchain. Tx hash: {tx_hash.hex()}")
    return receipt

# Retrieve from blockchain
def get_file_from_blockchain(file_id):
    file_hash, timestamp, user_id = contract.functions.getFile(file_id).call()
    print(f"File ID: {file_id}, Hash: {file_hash}, Timestamp: {timestamp}, User ID: {user_id}")
    return file_hash, timestamp, user_id

# Example usage
if __name__ == "__main__":
    # Ensure Ganache and IPFS daemon are running
    file_path = "test.txt"
    with open(file_path, "w") as f:
        f.write("Test file for Blockchain-Integrated-File-System")
    file_hash = upload_to_ipfs(file_path)
    if file_hash:
        add_file_to_blockchain(file_hash, "user123")
        get_file_from_blockchain(0)