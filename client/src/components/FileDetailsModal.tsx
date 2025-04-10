import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileWithStatus } from '@/lib/types';
import { FileIcon, Copy, Download, CheckCircle, Clock, Eye, PlayIcon, ImageIcon, FileTextIcon } from 'lucide-react';
import { formatDate, formatFileSize, canPreviewInBrowser, getFileIconByType } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilePreview from './FilePreview';
import { downloadFile } from '@/lib/api';

interface FileDetailsModalProps {
  file: FileWithStatus;
  onClose: () => void;
  onDownload: () => void;
}

export default function FileDetailsModal({ file, onClose, onDownload }: FileDetailsModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [fileData, setFileData] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isReady = file.status === 'verified';
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };
  
  const handlePreview = async () => {
    if (!file.hash || !isReady) return;
    
    setIsLoading(true);
    
    const privateKey = localStorage.getItem('blockchain-file-system-credentials') 
      ? JSON.parse(localStorage.getItem('blockchain-file-system-credentials') || '{}').privateKey 
      : '';
    
    if (!privateKey) {
      toast({
        title: "Missing private key",
        description: "Please enter your Private Key to preview files",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const data = await downloadFile(file.hash, file.version, privateKey);
      setFileData(data);
      setActiveTab("preview");
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Preview failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusIcon = () => {
    if (file.status === 'verified') {
      return <CheckCircle className="text-green-600 mr-1 h-4 w-4" />;
    } else if (file.status === 'processing') {
      return <Clock className="text-amber-600 mr-1 h-4 w-4" />;
    } else {
      return <span className="text-red-600 mr-1">!</span>;
    }
  };
  
  const formatFileType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'pdf': 'PDF Document',
      'docx': 'Microsoft Word Document',
      'xlsx': 'Microsoft Excel Spreadsheet',
      'pptx': 'Microsoft PowerPoint Presentation',
      'jpg': 'JPEG Image',
      'png': 'PNG Image',
      'mp4': 'MP4 Video',
      'mp3': 'MP3 Audio',
    };
    
    return typeMap[type.toLowerCase()] || type.toUpperCase();
  };
  
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
  
  const fileIcon = getFileIconByType(file.type);
  const canPreview = canPreviewInBrowser(file.type) && isReady;
  
  return (
    <Dialog open={!!file} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>File Details</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            {canPreview && (
              <TabsTrigger 
                value="preview" 
                className="flex-1"
                onClick={() => !fileData && handlePreview()}
              >
                Preview
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details">
            <div className="p-2">
              {/* File Info */}
              <div className="flex items-start mb-6">
                <div className={`w-16 h-16 flex items-center justify-center rounded ${fileIcon.bg} ${fileIcon.color} mr-4`}>
                  {renderIcon(fileIcon.iconName)}
                </div>
                <div>
                  <h4 className="text-xl font-medium">{file.filename}</h4>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {formatFileType(file.type)}
                  </p>
                  <div className="mt-2 flex items-center text-xs">
                    {getStatusIcon()}
                    <span className={`${
                      file.status === 'verified' 
                        ? 'text-green-600' 
                        : file.status === 'processing' 
                          ? 'text-amber-600' 
                          : 'text-red-600'
                    }`}>
                      {file.status === 'verified' 
                        ? 'Verified on blockchain' 
                        : file.status === 'processing' 
                          ? 'Processing blockchain verification' 
                          : 'Verification failed'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Metadata */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Metadata</h4>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-sm font-medium text-gray-900">{file.user_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Size</p>
                    <p className="text-sm font-medium text-gray-900">{formatFileSize(file.size)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">File Type</p>
                    <p className="text-sm font-medium text-gray-900">{file.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(file.upload_date || new Date().toISOString(), true)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Version</p>
                    <p className="text-sm font-medium text-gray-900">{file.version}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Modified</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(file.upload_date || new Date().toISOString(), true)}</p>
                  </div>
                </div>
              </div>
              
              {/* Blockchain Info */}
              {file.status !== 'processing' && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Blockchain Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">IPFS Hash</p>
                      <div className="flex items-center">
                        <p className="text-sm font-mono text-gray-900 break-all mr-2">{file.hash || 'N/A'}</p>
                        <button 
                          className="text-primary hover:text-primary-700"
                          onClick={() => file.hash && handleCopy(file.hash)}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                      <div className="flex items-center">
                        <p className="text-sm font-mono text-gray-900 break-all mr-2">{file.tx_hash || 'N/A'}</p>
                        <button 
                          className="text-primary hover:text-primary-700"
                          onClick={() => file.tx_hash && handleCopy(file.tx_hash)}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Blockchain Timestamp</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(file.upload_date || new Date().toISOString(), true)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Version History */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Version History</h4>
                <div className="space-y-4">
                  <div className="flex items-start border-l-2 border-primary pl-4">
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-900">Version {file.version} (Current)</p>
                      <p className="text-xs text-gray-500">Uploaded on {formatDate(file.upload_date || new Date().toISOString(), true)}</p>
                      <p className="text-xs text-gray-700 mt-1">{file.version === 1 ? 'Initial upload' : 'Updated version'}</p>
                    </div>
                    <button 
                      className={`text-primary text-sm font-medium hover:underline ${!isReady && 'opacity-50 cursor-not-allowed'}`}
                      onClick={isReady ? onDownload : undefined}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {canPreview && (
            <TabsContent value="preview" className="p-2">
              <FilePreview 
                file={file}
                fileData={fileData}
                isLoading={isLoading}
                onDownload={onDownload}
              />
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            {canPreview && !fileData && activeTab === "details" && (
              <Button 
                variant="outline" 
                onClick={handlePreview}
                disabled={!isReady || isLoading}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              disabled={!isReady}
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
