<h1>Blockchain-Integrated-File-System</h1>

A decentralized file storage and transfer system leveraging Ethereum and IPFS. This project uses a Solidity smart contract (FileStorage.sol) to store file metadata on the blockchain, IPFS for decentralized file storage, and a Python script to bridge the two, ensuring secure and tamper-proof file tracking.

## Features:
Smart Contract: Stores file metadata (fileHash, timestamp, userId) on Ethereum.
IPFS Integration: Uploads files to IPFS and retrieves them using their hashes.
Event Logging: Emits FileAdded events for each file stored.
Python Interface: Interacts with the blockchain and IPFS for file management.
Open Access: Anyone can add or retrieve file metadata (no access control implemented yet).

## Prerequisites
Node.js: v20.17.0 or later
Truffle: v5.11.5 (npm install -g truffle@5.11.5)
Ganache CLI: v7.9.1 (npm install -g ganache-cli@7.9.1)
Python: 3.x with pip
IPFS: Kubo v0.7.0 (compatible with ipfshttpclient)
Python Libraries: web3.py, requests, ipfshttpclient


# Installation:

### 1. Clone the Repository
git clone https://github.com/<your-username>/Blockchain-Integrated-File-System.git
cd Blockchain-Integrated-File-System

### 2. Install Node.js Dependencies:
Ensure Truffle and Ganache CLI are installed globally:
npm install -g truffle@5.11.5 ganache-cli@7.9.1

### 3. Install Python Dependencies:
pip install web3 requests ipfshttpclient

### 4. Install IPFS:
Download kubo_v0.7.0_windows-amd64.zip from dist.ipfs.tech.
Extract to C:\IPFS (or your preferred directory).
Add to PATH:
$env:Path += ";C:\IPFS"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\IPFS", [System.EnvironmentVariableTarget]::User)

### 5. Initialize IPFS:
ipfs init
