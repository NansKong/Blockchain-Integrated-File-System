import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileWithStatus } from '@/lib/types';
import FileCard from './FileCard';
import EmptyState from './EmptyState';
import { Search } from 'lucide-react';

interface FileListProps {
  files: FileWithStatus[];
  onSelect: (file: FileWithStatus) => void;
  onDownload: (file: FileWithStatus) => void;
}

export default function FileList({ files, onSelect, onDownload }: FileListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState('All Files');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileType === 'All Files' || file.type.toLowerCase() === fileType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold font-sans">My Files</h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search files..."
              className="pl-9 pr-3 py-1.5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-[130px] text-sm">
              <SelectValue placeholder="All Files" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Files">All Files</SelectItem>
              <SelectItem value="docx">Documents</SelectItem>
              <SelectItem value="xlsx">Spreadsheets</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
              <SelectItem value="jpg">Images</SelectItem>
              <SelectItem value="mp4">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onShowDetails={() => onSelect(file)}
              onPreview={() => {/* Not implemented */}}
              onDownload={() => onDownload(file)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
