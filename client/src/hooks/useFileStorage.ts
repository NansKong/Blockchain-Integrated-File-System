import { useState, useEffect } from 'react';
import { FileWithStatus, UploadProgress } from '@/lib/types';
import { uploadFile, downloadFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Mock files for immediate UI feedback - in a real app, this would come from a backend
const mockFiles: FileWithStatus[] = [];

export function useFileStorage() {
  const [files, setFiles] = useState<FileWithStatus[]>(mockFiles);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileWithStatus | null>(null);
  const { toast } = useToast();

  // Function to handle file upload
  const handleUploadFile = async (file: File) => {
    const userId = localStorage.getItem('blockchain-file-system-credentials') 
      ? JSON.parse(localStorage.getItem('blockchain-file-system-credentials') || '{}').userId 
      : '';
    
    const privateKey = localStorage.getItem('blockchain-file-system-credentials') 
      ? JSON.parse(localStorage.getItem('blockchain-file-system-credentials') || '{}').privateKey 
      : '';
    
    if (!userId || !privateKey) {
      toast({
        title: "Missing credentials",
        description: "Please save your User ID and Private Key before uploading files",
        variant: "destructive",
      });
      return;
    }
    
    // Initialize upload progress
    setUploadProgress({
      file,
      progress: 0,
      status: 'encrypting',
    });
    
    try {
      // Start upload with progress tracking
      setTimeout(() => {
        setUploadProgress(prev => prev ? { ...prev, progress: 25, status: 'uploading' } : null);
        
        setTimeout(() => {
          setUploadProgress(prev => prev ? { ...prev, progress: 75, status: 'blockchain' } : null);
          
          setTimeout(async () => {
            try {
              // In a real app, this would be the actual upload
              const response = await uploadFile(file, {
                userId,
                privateKey
              });
              
              // Mark upload as complete
              setUploadProgress(prev => prev ? { 
                ...prev, 
                progress: 100, 
                status: 'complete',
                ipfsHash: response.ipfs_hash,
                txHash: response.tx_hash
              } : null);
              
              // Add file to list
              const newFile: FileWithStatus = {
                id: uuidv4(),
                user_id: userId,
                filename: file.name,
                size: file.size,
                type: file.name.split('.').pop() || 'unknown',
                version: 1,
                upload_date: new Date().toISOString(),
                status: 'verified',
                hash: response.ipfs_hash,
                tx_hash: response.tx_hash
              };
              
              setFiles(prev => [newFile, ...prev]);
              
              toast({
                title: "Upload successful",
                description: `${file.name} has been uploaded and recorded on the blockchain.`,
                variant: "default",
              });
            } catch (error) {
              console.error('Upload error:', error);
              setUploadProgress(prev => prev ? { ...prev, status: 'error', error: String(error) } : null);
              
              toast({
                title: "Upload failed",
                description: String(error),
                variant: "destructive",
              });
            }
          }, 2000);
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => prev ? { ...prev, status: 'error', error: String(error) } : null);
      
      toast({
        title: "Upload failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  // Function to handle file download
  const handleDownloadFile = async (file: FileWithStatus) => {
    const privateKey = localStorage.getItem('blockchain-file-system-credentials') 
      ? JSON.parse(localStorage.getItem('blockchain-file-system-credentials') || '{}').privateKey 
      : '';
    
    if (!privateKey) {
      toast({
        title: "Missing private key",
        description: "Please enter your Private Key to download files",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Preparing download",
      description: "Decrypting file from blockchain storage...",
    });
    
    try {
      if (!file.hash) {
        throw new Error("File hash is missing");
      }
      
      const blob = await downloadFile(
        file.hash,
        file.version,
        privateKey
      );
      
      // Create a download link and trigger click
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your file download has started",
      });
    } catch (error) {
      console.error('Download error:', error);
      
      toast({
        title: "Download failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  return {
    files,
    uploadFile: handleUploadFile,
    downloadFile: handleDownloadFile,
    uploadProgress,
    setUploadProgress,
    selectedFile,
    selectFile: setSelectedFile,
  };
}
