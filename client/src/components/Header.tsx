import React from 'react';
import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2 cursor-pointer">
            <i className="fas fa-link-slash text-xl"></i>
            <h1 className="text-xl font-sans font-bold">BlockChain File System</h1>
          </a>
        </Link>
        
        <div className="flex items-center">
          <span className="hidden md:inline-block mr-3 text-sm">Welcome, User</span>
          <button className="p-2 rounded-full hover:bg-primary-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
