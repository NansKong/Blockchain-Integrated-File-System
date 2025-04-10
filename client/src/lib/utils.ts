import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  else return (bytes / 1073741824).toFixed(1) + " GB";
}

export function formatDate(date: string | Date, includeTime = false): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };

  return new Date(date).toLocaleDateString("en-US", options);
}

export function isImage(fileType: string): boolean {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  return imageTypes.includes(fileType.toLowerCase());
}

export function isVideo(fileType: string): boolean {
  const videoTypes = ["mp4", "webm", "ogg", "mov"];
  return videoTypes.includes(fileType.toLowerCase());
}

export function isAudio(fileType: string): boolean {
  const audioTypes = ["mp3", "wav", "ogg", "aac"];
  return audioTypes.includes(fileType.toLowerCase());
}

export function isPdf(fileType: string): boolean {
  return fileType.toLowerCase() === "pdf";
}

export function isTextFile(fileType: string): boolean {
  const textTypes = ["txt", "md", "json", "csv", "html", "xml", "js", "css", "ts"];
  return textTypes.includes(fileType.toLowerCase());
}

export function canPreviewInBrowser(fileType: string): boolean {
  return isImage(fileType) || isVideo(fileType) || isAudio(fileType) || isPdf(fileType) || isTextFile(fileType);
}

export function getFileIconByType(fileType: string) {
  if (isImage(fileType)) {
    return {
      iconName: "ImageIcon",
      bg: "bg-blue-100",
      color: "text-blue-700"
    };
  } else if (isVideo(fileType)) {
    return {
      iconName: "PlayIcon",
      bg: "bg-red-100",
      color: "text-red-700"
    };
  } else if (isAudio(fileType)) {
    return {
      iconName: "PlayIcon",
      bg: "bg-purple-100",
      color: "text-purple-700"
    };
  } else if (isPdf(fileType) || isTextFile(fileType)) {
    return {
      iconName: "FileTextIcon",
      bg: "bg-amber-100",
      color: "text-amber-700"
    };
  } else {
    return {
      iconName: "FileIcon",
      bg: "bg-gray-100",
      color: "text-gray-700"
    };
  }
}
