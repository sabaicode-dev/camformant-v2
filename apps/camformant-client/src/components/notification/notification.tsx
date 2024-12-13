"use client";

import { useAuth } from "@/context/auth";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useEffect, useState } from "react";
import { MdCircleNotifications } from "react-icons/md";
import AllowNotificationCard from "./allow-notification-card";

export default function NotificationComponent({
  addNotification,
}: {
  addNotification: (
    message: string,
    type: "success" | "info" | "error"
  ) => void;
}) {
  const { isAuthenticated } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isPopupNotificatioin, setIsPopupNotificatioin] = useState(false);
  const handlePopupNotification = () => {
    setIsPopupNotificatioin(!isPopupNotificatioin);
  };

  const [isVisible, setIsVisible] = useState(false); // For popup visibility
  const [loading, setLoading] = useState(false);
  console.log("sub:::", subscription);

  // Register Notification When User Login
  useEffect(() => {
    if (isAuthenticated) {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const serviceWorker = async () => {
          setIsSupported(true);
          await registerServiceWorker();
        };
        serviceWorker();
      }
    }
  }, [isAuthenticated, addNotification]);

  // Show Popup when browser is not support push notification
  useEffect(() => {
    if (isSupported) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 8000); // Hide after 5s
    }
  }, [isSupported]);

  async function registerServiceWorker() {
    // Check if service worker is already registered
    let registration = await navigator.serviceWorker.getRegistration("/");

    if (!registration) {
      // Register service worker if not registered
      registration = await navigator.serviceWorker.register(
        "/service-worker.js",
        {
          scope: "/",
          updateViaCache: "none",
        }
      );
    }
  }
  useEffect(() => {
    async function getSubscription() {
      const res = await axiosInstance.get(API_ENDPOINTS.NOTIFICATION);
      setSubscription(res.data[0]);
    }
    if (isAuthenticated && Notification.permission == "default") {
      return;
    } else if (isAuthenticated) {
      getSubscription();
    }
  }, [isAuthenticated, isPopupNotificatioin]);
  async function subscribeToPush() {
    setLoading(true);
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    setSubscription(sub);

    const subscriptionObject = sub.toJSON();
    // @ts-ignore
    const { p256dh, auth } = subscriptionObject.keys;

    try {
      const body = {
        endpoint: subscriptionObject.endpoint,
        keys: {
          p256dh,
          auth,
        },
      };

      // Send the subscription to your backend
      await axiosInstance.post(API_ENDPOINTS.SUBSCRIBE, body);
    } catch (error) {
      console.log("Subscribe Notification Error:::", error);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setLoading(true); // Set loading state

    try {
      await axiosInstance.delete(API_ENDPOINTS.UNSUBSCRIBE, {
        data: { endpoint: subscription?.endpoint },
      });
      await subscription?.unsubscribe();
    } catch (error) {
      console.log("Unsubscribe Notification Error:::", error);
    } finally {
      setSubscription(null);
      setLoading(false); // Unset loading state
    }
  }

  const handleToggle = async () => {
    async function checkPermission() {
      if (Notification.permission === "default") {
        setIsPopupNotificatioin(true);
        return;
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setSubscription(null);
          addNotification("Notification Access Dined", "error");
          return;
        } else if (permission === "granted") {
          subscribeToPush();
          addNotification("Notification Enabled", "success");
          return "granted";
        }
      }
    }
    if (!isAuthenticated) {
      addNotification("Please login to enable notification!", "error");
    } else {
      if (!subscription) {
        const permission = await checkPermission();
        if (permission === "granted") {
          await subscribeToPush();
        }
      } else {
        await unsubscribeFromPush();
      }
    }
  };

  if (!isSupported && isAuthenticated) {
    return (
      <div
        className={`fixed top-4 right-4 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-md transition-all transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transition: "all 0.5s ease", zIndex: 9999 }} // Smooth transition and ensure z-index is high
      >
        <p>Push notifications are not supported in this browser.</p>
      </div>
    );
  }

  const isDisable = loading && !isAuthenticated ? true : false;

  return (
    <div className={` flex items-center justify-between w-full  rounded-lg`}>
      {/* Left Section: Icon and Text */}
      {isPopupNotificatioin && (
        <AllowNotificationCard
          isShowPopup={isPopupNotificatioin}
          handlePopupNotification={handlePopupNotification}
        />
      )}
      <div className="flex items-center w-full gap-5 text-lg">
        <MdCircleNotifications size={22} />
        <span>Notification</span>
      </div>

      {/* Right Section: Toggle Switch */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isDisable ? false : !!subscription}
          onChange={handleToggle}
          disabled={isDisable}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
      </label>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array(rawData.split("").map((char) => char.charCodeAt(0)));
}
