import { Transaction } from "../types";
import { CalendarIcon, FileIcon, ArrowDownToLine } from "lucide-react";
import { formatFileSize, formatDate } from "../lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TransactionItemProps {
  transaction: Transaction;
  onDownload: (transaction: Transaction) => void;
}

export default function TransactionItem({ transaction, onDownload }: TransactionItemProps) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="truncate">
          <div className="flex text-sm">
            <p className="font-medium text-primary-600 truncate">
              {transaction.filename}
            </p>
            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
              v{transaction.version}
            </p>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <span>{formatDate(transaction.timestamp)}</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <FileIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              <span>{formatFileSize(transaction.size)}</span>
            </div>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="truncate">Tx: {transaction.txHash}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <Button
            variant="link"
            className="font-medium text-primary-600 hover:text-primary-500 p-0"
            onClick={() => onDownload(transaction)}
          >
            <ArrowDownToLine className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
