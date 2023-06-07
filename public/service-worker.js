self.addEventListener("install", (event) => {
  console.log("Service worker installed");

  // event.waitUntil(
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

// https://stackoverflow.com/questions/46541071/progressive-web-app-does-not-work-offline-error
self.addEventListener("fetch", function (event) {
  event.respondWith(
    (async function () {
      try {
        var res = await fetch(event.request);
        var cache = await caches.open("cache");
        cache.put(event.request.url, res.clone());
        return res;
      } catch (error) {
        return caches.match(event.request);
      }
    })()
  );
});
