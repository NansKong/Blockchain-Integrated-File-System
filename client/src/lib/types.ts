// File metadata type
export interface FileMetadata {
  user_id: string;
  filename: string;
  size: number;
  type: string;
  version: number;
  upload_date?: string;
  hash?: string;
  status?: 'processing' | 'verified' | 'failed';
  tx_hash?: string;
}

// File upload response from the API
export interface FileUploadResponse {
  ipfs_hash: string;
  tx_hash: string;
}

// User credentials
export interface UserCredentials {
  userId: string;
  privateKey: string;
}

// Upload progress state
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'encrypting' | 'uploading' | 'blockchain' | 'complete' | 'error';
  error?: string;
  ipfsHash?: string;
  txHash?: string;
}

// File with upload status
export interface FileWithStatus extends FileMetadata {
  id: string; // Generate a unique ID for each file in the UI
  status: 'processing' | 'verified' | 'failed';
}
