import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCredentials as UserCredentialsType } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface UserCredentialsProps {
  credentials: UserCredentialsType;
  onChange: (credentials: UserCredentialsType) => void;
  onSave: () => void;
}

export default function UserCredentials({ credentials, onChange, onSave }: UserCredentialsProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onChange({
      ...credentials,
      [id]: value,
    });
  };
  
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</h2>
      <div className="space-y-3">
        <div>
          <Label htmlFor="userId" className="text-xs font-medium text-gray-700 mb-1">User ID</Label>
          <Input
            type="text"
            id="userId"
            className="w-full text-sm"
            placeholder="Enter your user ID"
            value={credentials.userId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="privateKey" className="text-xs font-medium text-gray-700 mb-1">Private Key</Label>
          <div className="relative">
            <Input
              type={showPrivateKey ? "text" : "password"}
              id="privateKey"
              className="w-full text-sm pr-10"
              placeholder="Enter your private key"
              value={credentials.privateKey}
              onChange={handleInputChange}
            />
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              type="button"
            >
              {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">This key is used for encryption and blockchain transactions</p>
        </div>
        <Button 
          className="w-full"
          onClick={onSave}
        >
          Save Credentials
        </Button>
      </div>
    </div>
  );
}
