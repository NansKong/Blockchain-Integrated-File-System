import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { log } from './vite';

// Storage directory for simulated blockchain/IPFS files
const STORAGE_DIR = path.join(process.cwd(), 'blockchain_storage');
const METADATA_FILE = path.join(STORAGE_DIR, 'metadata.json');

// Create storage directory if it doesn't exist
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Initialize metadata file if it doesn't exist
if (!fs.existsSync(METADATA_FILE)) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify({ files: [], transactions: [] }));
}

// Get metadata from file
export function getMetadata() {
  return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
}

// Save metadata to file
export function saveMetadata(metadata: any) {
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

// Generate a hash for simulating blockchain hash
export function generateHash(): string {
  return crypto.createHash('sha256').update(Date.now().toString()).digest('hex');
}

// Simulate file upload to blockchain/IPFS
export async function uploadFileToBlockchain(
  fileBuffer: Buffer,
  filename: string,
  userId: string,
  privateKey: string
): Promise<{ ipfs_hash: string, tx_hash: string }> {
  try {
    // Generate file hash (simulating IPFS hash)
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Save file to storage
    const filePath = path.join(STORAGE_DIR, fileHash);
    fs.writeFileSync(filePath, fileBuffer);
    
    // Generate transaction hash (simulating blockchain transaction)
    const txHash = generateHash();
    
    // Update metadata
    const metadata = getMetadata();
    
    const fileMetadata = {
      hash: fileHash,
      user_id: userId,
      filename: filename,
      size: fileBuffer.length,
      type: path.extname(filename).slice(1) || 'unknown',
      version: 1,
      timestamp: Date.now(),
      tx_hash: txHash
    };
    
    const transactionMetadata = {
      tx_hash: txHash,
      hash: fileHash,
      filename: filename,
      size: fileBuffer.length,
      version: 1,
      timestamp: Date.now(),
      user_id: userId
    };
    
    metadata.files.push(fileMetadata);
    metadata.transactions.push(transactionMetadata);
    saveMetadata(metadata);
    
    log(`File uploaded to blockchain: ${filename} (${fileHash})`);
    
    // Return hashes
    return {
      ipfs_hash: fileHash,
      tx_hash: txHash
    };
  } catch (error) {
    log(`Error uploading file to blockchain: ${error}`);
    throw error;
  }
}

// Simulate file download from blockchain/IPFS
export async function downloadFileFromBlockchain(
  fileHash: string,
  version: number,
  privateKey: string
): Promise<{ data: Buffer, filename: string, mimetype: string }> {
  try {
    // Find file metadata
    const metadata = getMetadata();
    const fileMetadata = metadata.files.find(
      (file: any) => file.hash === fileHash && file.version === version
    );
    
    if (!fileMetadata) {
      throw new Error('File not found in blockchain');
    }
    
    // Get file from storage
    const filePath = path.join(STORAGE_DIR, fileHash);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found in storage');
    }
    
    const fileData = fs.readFileSync(filePath);
    
    log(`File downloaded from blockchain: ${fileMetadata.filename} (${fileHash})`);
    
    // Determine mimetype
    const extension = path.extname(fileMetadata.filename).slice(1).toLowerCase();
    let mimetype = 'application/octet-stream';
    
    switch (extension) {
      case 'pdf': mimetype = 'application/pdf'; break;
      case 'jpg': case 'jpeg': mimetype = 'image/jpeg'; break;
      case 'png': mimetype = 'image/png'; break;
      case 'gif': mimetype = 'image/gif'; break;
      case 'txt': mimetype = 'text/plain'; break;
      case 'html': mimetype = 'text/html'; break;
      case 'css': mimetype = 'text/css'; break;
      case 'js': mimetype = 'application/javascript'; break;
      case 'json': mimetype = 'application/json'; break;
      case 'xml': mimetype = 'application/xml'; break;
      case 'zip': mimetype = 'application/zip'; break;
      case 'doc': case 'docx': mimetype = 'application/msword'; break;
      case 'xls': case 'xlsx': mimetype = 'application/vnd.ms-excel'; break;
      case 'ppt': case 'pptx': mimetype = 'application/vnd.ms-powerpoint'; break;
      case 'mp3': mimetype = 'audio/mpeg'; break;
      case 'mp4': mimetype = 'video/mp4'; break;
      case 'avi': mimetype = 'video/x-msvideo'; break;
      case 'mov': mimetype = 'video/quicktime'; break;
      default: mimetype = 'application/octet-stream';
    }
    
    return {
      data: fileData,
      filename: fileMetadata.filename,
      mimetype
    };
  } catch (error) {
    log(`Error downloading file from blockchain: ${error}`);
    throw error;
  }
}

// Get files for a user
export function getFilesForUser(userId: string) {
  const metadata = getMetadata();
  return metadata.files.filter((file: any) => file.user_id === userId);
}

// Get transactions for a user
export function getTransactionsForUser(userId: string) {
  const metadata = getMetadata();
  return metadata.transactions.filter((tx: any) => tx.user_id === userId);
}