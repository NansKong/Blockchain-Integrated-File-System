import { Credentials, FileMetadata, UploadResponse } from "../types";
import { apiRequest } from "./queryClient";

// API for interacting with the backend

export async function uploadFile(
  file: File,
  credentials: Credentials
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", credentials.userId);
  formData.append("private_key", credentials.privateKey);

  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  return response.json();
}

export async function downloadFile(
  fileHash: string,
  version: number,
  privateKey: string
): Promise<Blob> {
  const response = await fetch("/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_hash: fileHash,
      version: version,
      private_key: privateKey,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  return response.blob();
}

export const getFiles = async (userId: string): Promise<FileMetadata[]> => {
  const res = await apiRequest("GET", `/api/files?user_id=${userId}`, undefined);
  return res.json();
};

export const getTransactions = async (userId: string) => {
  const res = await apiRequest("GET", `/api/transactions?user_id=${userId}`, undefined);
  return res.json();
};
