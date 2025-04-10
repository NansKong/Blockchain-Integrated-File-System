import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Credentials } from "../types";

interface CredentialsContextType {
  credentials: Credentials;
  updateCredentials: (creds: Credentials) => void;
  isAuthenticated: boolean;
}

const CredentialsContext = createContext<CredentialsContextType>({
  credentials: { userId: "", privateKey: "" },
  updateCredentials: () => {},
  isAuthenticated: false,
});

export const useCredentialsContext = () => useContext(CredentialsContext);

interface CredentialsProviderProps {
  children: ReactNode;
}

export const CredentialsProvider = ({ children }: CredentialsProviderProps) => {
  const [credentials, setCredentials] = useState<Credentials>({
    userId: "",
    privateKey: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load credentials from localStorage on mount
    const storedUserId = localStorage.getItem("blockfiles_user_id");
    const storedPrivateKey = localStorage.getItem("blockfiles_private_key");
    
    if (storedUserId && storedPrivateKey) {
      const loadedCredentials = {
        userId: storedUserId,
        privateKey: storedPrivateKey,
      };
      setCredentials(loadedCredentials);
      setIsAuthenticated(true);
    }
  }, []);

  const updateCredentials = (newCredentials: Credentials) => {
    if (newCredentials.userId && newCredentials.privateKey) {
      // Save to localStorage
      localStorage.setItem("blockfiles_user_id", newCredentials.userId);
      localStorage.setItem("blockfiles_private_key", newCredentials.privateKey);
      setCredentials(newCredentials);
      setIsAuthenticated(true);
    } else {
      // Clear credentials if either is empty
      localStorage.removeItem("blockfiles_user_id");
      localStorage.removeItem("blockfiles_private_key");
      setCredentials({ userId: "", privateKey: "" });
      setIsAuthenticated(false);
    }
  };

  return (
    <CredentialsContext.Provider
      value={{
        credentials,
        updateCredentials,
        isAuthenticated,
      }}
    >
      {children}
    </CredentialsContext.Provider>
  );
};
