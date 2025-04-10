import React from 'react';
import Layout from '@/components/Layout';
import FileUploader from '@/components/FileUploader';
import FileList from '@/components/FileList';
import FileDetailsModal from '@/components/FileDetailsModal';
import UploadProgressModal from '@/components/UploadProgressModal';
import { useFileStorage } from '@/hooks/useFileStorage';
import { useCredentials } from '@/hooks/useCredentials';

export default function Home() {
  const { 
    files, 
    uploadFile, 
    uploadProgress, 
    setUploadProgress, 
    selectedFile, 
    selectFile, 
    downloadFile 
  } = useFileStorage();
  
  const { credentials, setCredentials, saveCredentials } = useCredentials();

  return (
    <Layout>
      <div className="flex-grow p-4 md:p-6">
        <FileUploader 
          onUpload={uploadFile} 
          userId={credentials.userId}
          privateKey={credentials.privateKey}
          uploadProgress={uploadProgress}
        />
        
        <FileList 
          files={files}
          onSelect={selectFile}
          onDownload={downloadFile}
        />
        
        {selectedFile && (
          <FileDetailsModal
            file={selectedFile}
            onClose={() => selectFile(null)}
            onDownload={() => downloadFile(selectedFile)}
          />
        )}
        
        {uploadProgress && uploadProgress.status !== 'complete' && uploadProgress.status !== 'error' && (
          <UploadProgressModal
            progress={uploadProgress}
            onClose={() => setUploadProgress(null)}
            onCancel={() => setUploadProgress(null)}
          />
        )}
      </div>
    </Layout>
  );
}
