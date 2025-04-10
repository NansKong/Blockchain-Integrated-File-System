import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileCard from "../components/FileCard";
import { FileMetadata } from "../types";
import { getFiles } from "../lib/api";
import { downloadFile } from "../lib/api";
import { useCredentials } from "../hooks/useCredentials";
import { useToast } from "@/hooks/use-toast";

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, openCredentialsModal, credentials } = useCredentials();
  const { toast } = useToast();
  
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["/api/files", credentials.userId],
    queryFn: () => credentials.userId ? getFiles(credentials.userId) : Promise.resolve([]),
    staleTime: 1000 * 60, // 1 minute,
    enabled: !!credentials.userId, // Only run query when userId is available
  });

  const filteredFiles = searchQuery.trim()
    ? (files as FileMetadata[]).filter(
        (file) =>
          file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (files as FileMetadata[]);

  const handleDownload = async (file: FileMetadata) => {
    if (!isAuthenticated) {
      openCredentialsModal();
      return;
    }

    try {
      toast({
        title: "Downloading...",
        description: "Retrieving file from blockchain storage",
      });

      const blob = await downloadFile(
        file.hash,
        file.version,
        credentials.privateKey
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
        title: "Download complete",
        description: `${file.filename} has been downloaded successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-xl font-semibold text-gray-900">Your Files</h2>
        <div className="mt-3 md:mt-0 w-full md:w-auto flex space-x-2">
          <div className="relative flex-1 md:w-64">
            <Input
              type="text"
              placeholder="Search files..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Link href="/upload">
            <Button>
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Upload
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-opacity-50 border-t-primary-500 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading files...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading a file.</p>
          <div className="mt-6">
            <Link href="/upload">
              <Button>
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Upload a file
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
          {filteredFiles.map((file) => (
            <FileCard
              key={`${file.hash}-${file.version}`}
              file={file}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
