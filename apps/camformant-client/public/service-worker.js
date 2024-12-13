// Import Workbox library
// import { precacheAndRoute } from "workbox-precaching";
// console.log("hello service worker is on");

// Precache all assets injected by `next-pwa`
// precacheAndRoute(self.__WB_MANIFEST);
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  // Optionally skip waiting to activate immediately
  self.skipWaiting();
});
//related to notificationclick event
self.addEventListener("activate", (event) => {
  event.preventDefault();
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim()); // Take control of all open clients
});
// Custom event listeners for push notifications and notification click handling
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const title = data.title;
    const body = data.body;
    const url = data.data.url;
    const icon = data.icon;
    console.log("url", url);

    const notificationOptions = {
      title: title, //
      body: body,
      tag: `notification-${Date.now()}`,
      icon: icon,
      vibrate: [100, 50, 100],
      data: {
        url: url,
      },
      timestamp: Date.now(),
    };

    console.log("Push Notification Trigger", notificationOptions);

    event.waitUntil(
      self.registration.showNotification(title, notificationOptions)
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");

  // Close the notification
  event.notification.close();
  console.log("data:", event);

  const urlToOpen = event.notification.data.url;
  console.log("urlToOpen", urlToOpen);
  console.log("event::", event.notification);
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's an open tab with the same origin as the URL (i.e., same app)
        const client = clientList.find(
          (c) => c.url.startsWith(self.location.origin) && "focus" in c
        );

        if (client) {
          // If a client is found, focus on that tab
          client.focus();
          // Use the client to navigate to the new URL
          return client.navigate(urlToOpen);
        } else {
          // If no client is found, open a new tab
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
