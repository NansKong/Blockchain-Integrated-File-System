import React from 'react';
import { Link, useLocation } from 'wouter';
import UserCredentials from './UserCredentials';
import { UserCredentials as UserCredentialsType } from '@/lib/types';

interface SidebarProps {
  credentials: UserCredentialsType;
  onCredentialsChange: (credentials: UserCredentialsType) => void;
  onSaveCredentials: () => void;
}

export default function Sidebar({ credentials, onCredentialsChange, onSaveCredentials }: SidebarProps) {
  const [location] = useLocation();
  
  return (
    <aside className="bg-white shadow-md w-full md:w-64 md:min-h-screen">
      <nav className="p-4">
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/">
                <a className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                  location === '/' ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>Upload Files</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/files">
                <a className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                  location === '/files' ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span>My Files</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/history">
                <a className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                  location === '/history' ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                } font-medium`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Transaction History</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Storage</h2>
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-600">Storage Overview</span>
              <span className="text-xs text-gray-600">IPFS</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
        
        <UserCredentials
          credentials={credentials}
          onChange={onCredentialsChange}
          onSave={onSaveCredentials}
        />
      </nav>
    </aside>
  );
}
