import { AlertContext } from "@/contexts/AlertContext";
import { useContext } from "react";

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return context;
};
