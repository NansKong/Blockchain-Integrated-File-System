import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { formatFileSize } from "../lib/utils";
import { UploadResponse } from "../types";
import { CheckCircle, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
  onUpload: (file: File) => Promise<UploadResponse>;
  disabled?: boolean;
}

export default function FileDropzone({ onUpload, disabled = false }: FileDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUploadResult, setLastUploadResult] = useState<UploadResponse | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadSuccess(false);
      setUploadError(null);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    disabled: disabled || uploadProgress > 0
  });

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError(null);
    setLastUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(10);
      
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const result = await onUpload(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      setLastUploadResult(result);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
          isDragActive 
            ? "border-primary-300 bg-primary-50" 
            : "border-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 ${
                disabled ? "pointer-events-none" : ""
              }`}
            >
              <span>Upload a file</span>
              <input {...getInputProps()} id="file-upload" className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            All file types supported up to 10MB
          </p>
        </div>
      </div>

      {selectedFile && (
        <Card className="mt-6 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                <UploadIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">{selectedFile.name}</h3>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              disabled={uploadProgress > 0 && uploadProgress < 100}
            >
              <X className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </Card>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-primary-600">
                  Uploading
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-primary-600">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        </div>
      )}

      {uploadSuccess && lastUploadResult && (
        <Alert className="mt-4 border-green-100 bg-green-50 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <AlertTitle>Upload successful</AlertTitle>
          <AlertDescription>
            <p>File has been successfully uploaded and recorded on the blockchain.</p>
            <div className="mt-2 text-sm">
              <p className="font-medium">Transaction Details:</p>
              <p className="truncate">IPFS Hash: {lastUploadResult.ipfs_hash}</p>
              <p className="truncate">Transaction: {lastUploadResult.tx_hash}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {uploadError && (
        <Alert className="mt-4 border-red-100 bg-red-50 text-red-800">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        {(selectedFile || uploadSuccess || uploadError) && (
          <Button 
            variant="outline"
            onClick={resetUpload}
          >
            Reset
          </Button>
        )}
        
        {selectedFile && !(uploadSuccess || uploadError) && (
          <Button 
            onClick={handleUpload}
            disabled={disabled || uploadProgress > 0}
          >
            Upload to Blockchain
          </Button>
        )}
      </div>
    </div>
  );
}
