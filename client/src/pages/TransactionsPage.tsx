import { useQuery } from "@tanstack/react-query";
import { Transaction } from "../types";
import TransactionItem from "../components/TransactionItem";
import { downloadFile } from "../lib/api";
import { getTransactions } from "../lib/api";
import { useCredentials } from "../hooks/useCredentials";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

export default function TransactionsPage() {
  const { isAuthenticated, openCredentialsModal, credentials } = useCredentials();
  const { toast } = useToast();
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions", credentials.userId],
    queryFn: () => credentials.userId ? getTransactions(credentials.userId) : Promise.resolve([]),
    staleTime: 1000 * 60, // 1 minute,
    enabled: !!credentials.userId, // Only run query when userId is available
  });

  const handleDownload = async (transaction: Transaction) => {
    if (!isAuthenticated) {
      openCredentialsModal();
      return;
    }

    if (!transaction.hash) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "File hash not available for this transaction",
      });
      return;
    }

    try {
      toast({
        title: "Downloading...",
        description: "Retrieving file from blockchain storage",
      });

      const blob = await downloadFile(
        transaction.hash,
        transaction.version,
        credentials.privateKey
      );

      // Create a download link and trigger click
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = transaction.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download complete",
        description: `${transaction.filename} has been downloaded successfully`,
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
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-opacity-50 border-t-primary-500 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
            <p className="mt-1 text-sm text-gray-500">Your blockchain transaction history will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {(transactions as Transaction[]).map((transaction) => (
              <li key={transaction.txHash}>
                <TransactionItem
                  transaction={transaction}
                  onDownload={handleDownload}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
