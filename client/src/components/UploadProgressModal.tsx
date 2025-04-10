import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadProgress } from '@/lib/types';
import { CheckCircle, RefreshCcw, Clock } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface UploadProgressModalProps {
  progress: UploadProgress;
  onClose: () => void;
  onCancel: () => void;
}

export default function UploadProgressModal({ progress, onClose, onCancel }: UploadProgressModalProps) {
  const { file, progress: uploadProgress, status } = progress;
  
  const getStepState = (step: string) => {
    const stepOrder = ['encrypting', 'uploading', 'blockchain', 'complete'];
    const currentIndex = stepOrder.indexOf(status);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'waiting';
  };
  
  const getStepIcon = (step: string) => {
    const state = getStepState(step);
    
    if (state === 'completed') {
      return <CheckCircle className="h-4 w-4 text-white" />;
    } else if (state === 'current') {
      return <RefreshCcw className="h-4 w-4 text-white animate-spin" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStepLabel = () => {
    switch (status) {
      case 'encrypting':
        return 'Encrypting file';
      case 'uploading':
        return 'Uploading to IPFS';
      case 'blockchain':
        return 'Writing to blockchain';
      case 'complete':
        return 'Upload complete';
      case 'error':
        return 'Upload failed';
      default:
        return 'Processing';
    }
  };
  
  return (
    <Dialog open={!!progress} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Uploading File</DialogTitle>
        </DialogHeader>
        
        <div className="p-2">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary bg-opacity-10 rounded-full mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
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
            </div>
            <h4 className="text-lg font-medium">{file.name}</h4>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}</p>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{getStepLabel()}</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                getStepState('encrypting') === 'completed' 
                  ? 'bg-green-600' 
                  : getStepState('encrypting') === 'current' 
                    ? 'bg-primary animate-pulse' 
                    : 'bg-gray-200'
              } text-white mr-2`}>
                {getStepIcon('encrypting')}
              </div>
              <p className="text-sm">Encryption {getStepState('encrypting') === 'completed' ? 'completed' : getStepState('encrypting') === 'current' ? 'in progress' : 'pending'}</p>
            </div>
            <div className="flex items-center">
              <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                getStepState('uploading') === 'completed' 
                  ? 'bg-green-600' 
                  : getStepState('uploading') === 'current' 
                    ? 'bg-primary animate-pulse' 
                    : 'bg-gray-200'
              } text-white mr-2`}>
                {getStepIcon('uploading')}
              </div>
              <p className="text-sm">Uploading to IPFS storage {getStepState('uploading') === 'completed' ? 'completed' : getStepState('uploading') === 'current' ? 'in progress' : 'pending'}</p>
            </div>
            <div className="flex items-center">
              <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                getStepState('blockchain') === 'completed' 
                  ? 'bg-green-600' 
                  : getStepState('blockchain') === 'current' 
                    ? 'bg-primary animate-pulse' 
                    : 'bg-gray-200'
              } text-white mr-2`}>
                {getStepIcon('blockchain')}
              </div>
              <p className="text-sm">Writing to blockchain {getStepState('blockchain') === 'completed' ? 'completed' : getStepState('blockchain') === 'current' ? 'in progress' : 'pending'}</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            Your file is being securely uploaded. Writing to the blockchain may take several minutes depending on network congestion.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Minimize
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
