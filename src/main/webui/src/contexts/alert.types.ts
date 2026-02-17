export type AlertType = "success" | "error" | "info" | "warning";

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
}
