import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Database, Upload, FileText, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import CredentialsModal from "./CredentialsModal";
import { useCredentials } from "../hooks/useCredentials";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { openCredentialsModal, showModal, closeCredentialsModal, saveCredentials, credentials } = useCredentials();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <h1 className="ml-2 text-xl font-semibold text-gray-900">BlockFiles</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/">
                  <a
                    className={`${
                      location === "/"
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Files
                  </a>
                </Link>
                <Link href="/upload">
                  <a
                    className={`${
                      location === "/upload"
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Upload
                  </a>
                </Link>
                <Link href="/transactions">
                  <a
                    className={`${
                      location === "/transactions"
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Transactions
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="default"
                onClick={openCredentialsModal}
                className="ml-3 inline-flex items-center"
              >
                <Key className="mr-2 -ml-1 h-4 w-4" />
                Credentials
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-gray-200 bg-white">
        <div className="flex justify-around">
          <Link href="/">
            <a
              className={`py-2 px-4 text-center flex-1 ${
                location === "/" 
                  ? "text-primary-600 border-b-2 border-primary-500" 
                  : ""
              }`}
            >
              <FileText className="h-6 w-6 mx-auto" />
              <span className="text-xs">Files</span>
            </a>
          </Link>
          <Link href="/upload">
            <a
              className={`py-2 px-4 text-center flex-1 ${
                location === "/upload" 
                  ? "text-primary-600 border-b-2 border-primary-500" 
                  : ""
              }`}
            >
              <Upload className="h-6 w-6 mx-auto" />
              <span className="text-xs">Upload</span>
            </a>
          </Link>
          <Link href="/transactions">
            <a
              className={`py-2 px-4 text-center flex-1 ${
                location === "/transactions" 
                  ? "text-primary-600 border-b-2 border-primary-500" 
                  : ""
              }`}
            >
              <Database className="h-6 w-6 mx-auto" />
              <span className="text-xs">Transactions</span>
            </a>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://github.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} BlockFiles. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <CredentialsModal 
        isOpen={showModal} 
        onClose={closeCredentialsModal} 
        onSave={saveCredentials}
        initialUserId={credentials.userId}
        initialPrivateKey={credentials.privateKey}
      />
    </div>
  );
}
