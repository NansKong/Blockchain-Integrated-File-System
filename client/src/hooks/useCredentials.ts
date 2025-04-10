import { useState } from "react";
import { useCredentialsContext } from "../context/CredentialsContext";
import { useToast } from "@/hooks/use-toast";

export function useCredentials() {
  const [showModal, setShowModal] = useState(false);
  const { credentials, updateCredentials, isAuthenticated } = useCredentialsContext();
  const { toast } = useToast();

  const openCredentialsModal = () => {
    setShowModal(true);
  };

  const closeCredentialsModal = () => {
    setShowModal(false);
  };

  const saveCredentials = (userId: string, privateKey: string) => {
    if (!userId || !privateKey) {
      toast({
        title: "Missing credentials",
        description: "Both User ID and Private Key are required",
        variant: "destructive",
      });
      return;
    }

    updateCredentials({ userId, privateKey });
    toast({
      title: "Credentials saved",
      description: "Your blockchain credentials have been saved",
    });
    closeCredentialsModal();
  };

  return {
    credentials,
    isAuthenticated,
    showModal,
    openCredentialsModal,
    closeCredentialsModal,
    saveCredentials,
  };
}
