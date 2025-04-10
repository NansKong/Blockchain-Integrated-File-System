import React from 'react';
import { Button } from '@/components/ui/button';
import { Folder } from 'lucide-react';

interface EmptyStateProps {
  onUpload?: () => void;
}

export default function EmptyState({ onUpload }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-dashed mt-4">
      <div className="max-w-md mx-auto">
        <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No files yet</h3>
        <p className="text-gray-500 mb-6">Upload your first file to see it here.</p>
        <Button onClick={onUpload}>
          Upload Files
        </Button>
      </div>
    </div>
  );
}
