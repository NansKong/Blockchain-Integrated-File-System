export interface Credentials {
  userId: string;
  privateKey: string;
}

export interface FileMetadata {
  hash: string;
  filename: string;
  size: number;
  type: string;
  version: number;
  user_id: string;
}

export interface Transaction {
  txHash: string;
  filename: string;
  size: number;
  timestamp: Date;
  version: number;
  hash?: string;
}

export interface UploadResponse {
  ipfs_hash: string;
  tx_hash: string;
}
