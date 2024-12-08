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
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim()); // Take control of all open clients
});
// Custom event listeners for push notifications and notification click handling
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const title = data.title;
    const body = data.body;
    const url = "/resume";
    console.log("url", url);

    const notificationOptions = {
      body: body,
      tag: `notification-${Date.now()}`,
      icon: "https://english.mathrubhumi.com/image/contentid/policy:1.10120314:1732882988/banana-art-sun.jpg?$p=9e6d4c8&f=1x1&w=1080&q=0.8",
      vibrate: [100, 50, 100],
      data: {
        url: url, // Replace with the desired URL for redirecting user to the desired page
      },
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

  const notificationData = event.notification.data;
  const urlToOpen = "/resume"; // Fallback to root if no URL is provided
  console.log("urlToOpen", urlToOpen);

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
