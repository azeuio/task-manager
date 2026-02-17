import { useReducer } from "react";
import type { Alert, AlertType } from "./alert.types";
import { AlertContext } from "./AlertContext";

interface AlertState {
  alerts: Alert[];
}

type Action =
  | { type: "ADD_ALERT"; payload: Alert }
  | { type: "REMOVE_ALERT"; payload: string };

const alertReducer = (state: AlertState, action: Action): AlertState => {
  console.log("Alert Reducer Action:", action);
  switch (action.type) {
    case "ADD_ALERT":
      return { alerts: [...state.alerts, action.payload] };
    case "REMOVE_ALERT":
      return {
        alerts: state.alerts.filter((a) => a.id !== action.payload),
      };
    default:
      return state;
  }
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(alertReducer, { alerts: [] });

  const showAlert = (
    message: string,
    type: AlertType = "info",
    timeout = 3000,
  ) => {
    const id = crypto.randomUUID();

    dispatch({
      type: "ADD_ALERT",
      payload: { id, message, type },
    });

    setTimeout(() => {
      dispatch({ type: "REMOVE_ALERT", payload: id });
    }, timeout);
  };

  const removeAlert = (id: string) => {
    dispatch({ type: "REMOVE_ALERT", payload: id });
  };

  return (
    <AlertContext.Provider value={{ showAlert, removeAlert, state }}>
      {children}

      {/* Alert Container */}
      {/* <div className="relative w-full flex items-center justify-center">
        <div
          role="alert"
          className="alert alert-warning absolute top-4"
          // hidden={!state.alerts.length}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            {state.alerts[0]?.message || "Warning: Invalid email address!"}
          </span>
        </div>
      </div> */}
    </AlertContext.Provider>
  );
};
