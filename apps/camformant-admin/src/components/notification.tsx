import { useCallback, useState } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState<string | null>();
  const addNotification = useCallback((message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, []);
  const DisplayNotification = useCallback(() => {
    if (!notification) return null;
    return (
      <div
        className="absolute left-1/2 top-2 transform -translate-x-1/2 flex items-center p-4 mb-4 text-lg text-red-600 rounded-lg dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>{notification}</div>
      </div>
    );
  }, [notification]);
  return { addNotification, DisplayNotification };
};
