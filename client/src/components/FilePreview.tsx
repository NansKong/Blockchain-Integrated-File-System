import React, { useState, useEffect } from 'react';
import { 
  isImage, 
  isVideo, 
  isAudio, 
  isPdf, 
  isTextFile, 
  canPreviewInBrowser,
  getFileIconByType
} from '@/lib/utils';
import { Download, PlayCircle, Eye, FileIcon, ImageIcon, FileTextIcon, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileWithStatus } from '@/lib/types';

interface FilePreviewProps {
  file: FileWithStatus;
  fileData?: Blob | null;
  isLoading: boolean;
  onDownload: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  fileData, 
  isLoading, 
  onDownload 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  
  useEffect(() => {
    if (fileData) {
      const url = URL.createObjectURL(fileData);
      setPreviewUrl(url);
      
      // For text files, extract content to display
      if (isTextFile(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setTextContent(e.target.result as string);
          }
        };
        reader.readAsText(fileData);
      }
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [fileData, file.type]);
  
  // Render appropriate icon based on file type
  const renderIcon = (iconName: string, className = "h-7 w-7") => {
    switch (iconName) {
      case "ImageIcon":
        return <ImageIcon className={className} />;
      case "PlayIcon":
        return <PlayIcon className={className} />;
      case "FileTextIcon":
        return <FileTextIcon className={className} />;
      default:
        return <FileIcon className={className} />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-lg">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }
  
  if (!fileData) {
    const fileIcon = getFileIconByType(file.type);
    
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className={`w-16 h-16 ${fileIcon.bg} ${fileIcon.color} rounded-lg flex items-center justify-center mb-4`}>
          {renderIcon(fileIcon.iconName)}
        </div>
        <p className="text-gray-600 mb-2">No preview available</p>
        <Button onClick={onDownload} className="mt-4">
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  }
  
  if (isImage(file.type) && previewUrl) {
    return (
      <div className="flex flex-col items-center h-auto max-h-[500px] bg-white rounded-lg overflow-hidden">
        <div className="relative w-full overflow-hidden flex items-center justify-center">
          <img 
            src={previewUrl} 
            alt={file.filename} 
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={() => window.open(previewUrl, '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            Open Full Size
          </Button>
        </div>
      </div>
    );
  }
  
  if (isVideo(file.type) && previewUrl) {
    return (
      <div className="flex flex-col items-center h-auto bg-gray-900 rounded-lg overflow-hidden">
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <video 
            src={previewUrl} 
            controls
            className="max-w-full max-h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4 w-full bg-gray-800 p-4 flex justify-center">
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Video
          </Button>
        </div>
      </div>
    );
  }
  
  if (isAudio(file.type) && previewUrl) {
    return (
      <div className="flex flex-col items-center h-auto bg-gray-50 rounded-lg p-8">
        <div className={`w-16 h-16 mb-6 ${getFileIconByType(file.type).bg} ${getFileIconByType(file.type).color} rounded-full flex items-center justify-center`}>
          <PlayCircle className="h-8 w-8" />
        </div>
        <div className="w-full mb-6">
          <audio 
            src={previewUrl} 
            controls
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Audio
        </Button>
      </div>
    );
  }
  
  if (isPdf(file.type) && previewUrl) {
    return (
      <div className="flex flex-col items-center h-auto bg-gray-50 rounded-lg overflow-hidden">
        <div className="relative w-full h-[500px] border border-gray-200">
          <iframe 
            src={`${previewUrl}#view=FitH`} 
            className="w-full h-full" 
            title={file.filename}
          >
            Your browser does not support PDF preview.
          </iframe>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={() => window.open(previewUrl, '_blank')}>
            <Eye className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }
  
  if (isTextFile(file.type) && textContent) {
    return (
      <div className="flex flex-col h-auto bg-gray-50 rounded-lg overflow-hidden">
        <pre className="whitespace-pre-wrap bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto h-[350px] text-sm font-mono">
          {textContent}
        </pre>
        <div className="mt-4 flex justify-center">
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download File
          </Button>
        </div>
      </div>
    );
  }
  
  // Fallback for non-previewable files
  const fileIcon = getFileIconByType(file.type);
  return (
    <div className="flex flex-col items-center justify-center h-80 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className={`w-16 h-16 ${fileIcon.bg} ${fileIcon.color} rounded-lg flex items-center justify-center mb-4`}>
        {renderIcon(fileIcon.iconName)}
      </div>
      <p className="text-gray-600 mb-2">Preview not available for this file type</p>
      <p className="text-gray-500 text-sm mb-4">{file.type.toUpperCase()} file</p>
      <Button onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download File
      </Button>
    </div>
  );
};

export default FilePreview;