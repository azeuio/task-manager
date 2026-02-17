import { createContext } from "react";
import type { Alert, AlertType } from "./alert.types";

export const AlertContext = createContext<{
  showAlert: (message: string, type?: AlertType, timeout?: number) => void;
  removeAlert: (id: string) => void;
  state: { alerts: Alert[] };
} | null>(null);
