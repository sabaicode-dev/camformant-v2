import { useCallback, useState } from "react";
import { PiWarningCircleFill } from "react-icons/pi";

export const useNotification = () => {
  const [notification, setNotification] = useState<string | null>();
  const addNotification = useCallback((message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);
  const DisplayNotification = useCallback(() => {
    if (!notification) return null;
    return (
      <div
        className="absolute left-1/2 top-2 transform -translate-x-1/2 flex items-center p-4 mb-4 text-lg text-red-600 rounded-lg dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
       <PiWarningCircleFill color="red" size={25} className="mr-1"/>
        <span className="sr-only">Info</span>
        <div>{notification}</div>
      </div>
    );
  }, [notification]);
  return { addNotification, DisplayNotification };
};
