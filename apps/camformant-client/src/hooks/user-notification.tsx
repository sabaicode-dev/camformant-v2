import { AnimatedList } from "@/components/animation/animation-list";
import { useState, useCallback } from "react";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export interface Notification {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}
export type AddNotificationType = (message: string, type: "success" | "info" | "error") => void;

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const addNotification = useCallback(
    (message: string, type: "success" | "info" | "error") => {
      const id = Date.now();
      setNotification({ id, message, type });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    },
    []
  );

  const NotificationDisplay = useCallback(() => {
    if (!notification) return null;

    return (
      <div className="fixed z-50 w-full transform -translate-x-1/2 top-5 left-1/2">
        <AnimatedList>
          <div
            key={notification.id}
            className={`p-4 rounded-2xl flex items-center ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "info"
                  ? "bg-blue-500"
                  : "bg-red-500"
            } text-white`}
          >
            {notification.type === "success" && (
              <FaCheckCircle className="mr-4" />
            )}
            {notification.type === "info" && <FaInfoCircle className="mr-4" />}
            {notification.type === "error" && (
              <FaExclamationCircle className="mr-4" />
            )}
            <span>{notification.message}</span>
          </div>
        </AnimatedList>
      </div>
    );
  }, [notification]);

  return { addNotification, NotificationDisplay };
};
