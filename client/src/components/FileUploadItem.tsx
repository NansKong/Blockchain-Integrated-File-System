import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/lib/utils';
import { X } from 'lucide-react';

interface FileUploadItemProps {
  file: File;
  progress: number;
  status: 'encrypting' | 'uploading' | 'blockchain' | 'complete' | 'error';
  onRemove: () => void;
}

export default function FileUploadItem({ file, progress, status, onRemove }: FileUploadItemProps) {
  const getFileIcon = () => {
    const type = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(type)) {
      return <i className="fas fa-file-image"></i>;
    } else if (['pdf'].includes(type)) {
      return <i className="fas fa-file-pdf"></i>;
    } else if (['doc', 'docx'].includes(type)) {
      return <i className="fas fa-file-word"></i>;
    } else if (['xls', 'xlsx'].includes(type)) {
      return <i className="fas fa-file-excel"></i>;
    } else if (['ppt', 'pptx'].includes(type)) {
      return <i className="fas fa-file-powerpoint"></i>;
    } else if (['zip', 'rar', '7z'].includes(type)) {
      return <i className="fas fa-file-archive"></i>;
    } else {
      return <i className="fas fa-file"></i>;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'encrypting':
        return 'Encrypting';
      case 'uploading':
        return 'Uploading';
      case 'blockchain':
        return 'Recording on blockchain';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Failed';
      default:
        return 'Processing';
    }
  };
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds left`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes left`;
    } else {
      return `${Math.floor(seconds / 3600)} hours left`;
    }
  };
  
  // Estimate time remaining based on progress percentage
  const estimateTimeRemaining = () => {
    if (progress === 0) return '...';
    const averageUploadSpeed = 500 * 1024; // 500 KB/s (example speed)
    const bytesUploaded = file.size * (progress / 100);
    const bytesRemaining = file.size - bytesUploaded;
    const secondsRemaining = Math.ceil(bytesRemaining / averageUploadSpeed);
    
    return formatTime(secondsRemaining);
  };
  
  return (
    <div className="flex items-center">
      <div className="mr-3 text-2xl text-gray-400">
        {getFileIcon()}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h4 className="font-medium text-gray-900">{file.name}</h4>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
            </p>
          </div>
          <button 
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <Progress value={progress} className="h-1.5" />
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {progress}% • {formatFileSize(file.size * progress / 100)} / {formatFileSize(file.size)}
          </span>
          <span className="text-xs text-gray-500">{getStatusText()} {progress < 100 && estimateTimeRemaining()}</span>
        </div>
      </div>
    </div>
  );
}
