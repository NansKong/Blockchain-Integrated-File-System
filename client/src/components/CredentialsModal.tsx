import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, privateKey: string) => void;
  initialUserId?: string;
  initialPrivateKey?: string;
}

export default function CredentialsModal({
  isOpen,
  onClose,
  onSave,
  initialUserId = "",
  initialPrivateKey = "",
}: CredentialsModalProps) {
  const [userId, setUserId] = useState(initialUserId);
  const [privateKey, setPrivateKey] = useState(initialPrivateKey);

  useEffect(() => {
    if (isOpen) {
      setUserId(initialUserId);
      setPrivateKey(initialPrivateKey);
    }
  }, [isOpen, initialUserId, initialPrivateKey]);

  const handleSave = () => {
    onSave(userId, privateKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Blockchain Credentials</DialogTitle>
          <DialogDescription>
            Enter your user ID and private key to interact with the blockchain.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="user-id">User ID</Label>
            <Input
              id="user-id"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="private-key">Private Key</Label>
            <Input
              id="private-key"
              type="password"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This is used for encryption and blockchain transactions.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
