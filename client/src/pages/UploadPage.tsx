import { useCredentials } from "../hooks/useCredentials";
import FileDropzone from "../components/FileDropzone";
import { uploadFile } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const { isAuthenticated, openCredentialsModal, credentials } = useCredentials();
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!isAuthenticated) {
      openCredentialsModal();
      throw new Error("Please enter your credentials before uploading");
    }

    try {
      const result = await uploadFile(file, credentials);
      
      // Invalidate files and transactions queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      
      return result;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      throw error;
    }
  };
  
  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Files</h2>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <FileDropzone 
            onUpload={handleUpload} 
            disabled={!isAuthenticated}
          />
          
          {!isAuthenticated && (
            <div className="mt-4 p-4 rounded-md bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Blockchain credentials required</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>You need to set your User ID and Private Key before uploading files.</p>
                    <button 
                      onClick={openCredentialsModal}
                      className="font-medium text-yellow-800 hover:text-yellow-900 underline mt-1"
                    >
                      Set credentials
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
