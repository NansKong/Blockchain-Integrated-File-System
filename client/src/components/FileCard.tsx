import { FileMetadata } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "../lib/utils";

interface FileCardProps {
  file: FileMetadata;
  onDownload: (file: FileMetadata) => void;
}

export default function FileCard({ file, onDownload }: FileCardProps) {
  const isImage = (fileType: string) => {
    const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    return imageTypes.includes(fileType.toLowerCase());
  };

  return (
    <Card className="overflow-hidden hover:shadow transition-shadow duration-200">
      <div className="h-36 bg-gray-100 flex items-center justify-center">
        {isImage(file.type) ? (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <Image className="h-12 w-12 text-gray-400" />
          </div>
        ) : (
          <div className="text-center p-4">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <span className="mt-2 text-sm font-medium text-gray-900 uppercase">
              {file.type}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {file.filename}
          </h3>
          <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <span className="truncate">Version {file.version}</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <div className="mr-1 h-2 w-2 rounded-full bg-purple-400" />
            On Blockchain
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-600 hover:text-primary-900"
            onClick={() => onDownload(file)}
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
