import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadProgress } from '@/lib/types';
import FileUploadItem from './FileUploadItem';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  userId: string;
  privateKey: string;
  uploadProgress: UploadProgress | null;
}

export default function FileUploader({ onUpload, userId, privateKey, uploadProgress }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    if (!userId || !privateKey) {
      toast({
        title: "Missing credentials",
        description: "Please enter your User ID and Private Key before uploading files.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert FileList to array
    const files = Array.from(fileList);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Start upload for the first file
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold font-sans">Upload File</h2>
        <button className="text-xs text-primary font-medium hover:underline">
          Need Help?
        </button>
      </div>
      
      <div
        className={`border-2 border-dashed ${
          isDragging ? 'border-primary' : 'border-gray-300'
        } rounded-lg bg-white p-6 text-center cursor-pointer hover:border-primary transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
        />
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-1">Drag files here or click to browse</h3>
        <p className="text-sm text-gray-500">Any file type is supported. Files will be encrypted before storage.</p>
        
        <div className="mt-4 flex flex-col items-center">
          <Button>
            Select Files
          </Button>
          <p className="mt-2 text-xs text-gray-500">or drag and drop your files</p>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            {selectedFiles.map((file, index) => (
              <FileUploadItem
                key={index}
                file={file}
                progress={uploadProgress && uploadProgress.file.name === file.name ? uploadProgress.progress : 0}
                status={uploadProgress && uploadProgress.file.name === file.name ? uploadProgress.status : 'encrypting'}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={() => setSelectedFiles([])}>
              Cancel
            </Button>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={openFileDialog}>
                Add More Files
              </Button>
              <Button
                disabled={!selectedFiles.length || (uploadProgress && uploadProgress.status !== 'complete')}
                onClick={() => {
                  // If there's already an upload in progress, don't start a new one
                  if (!uploadProgress || uploadProgress.status === 'complete') {
                    onUpload(selectedFiles[0]);
                  }
                }}
              >
                Upload All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
