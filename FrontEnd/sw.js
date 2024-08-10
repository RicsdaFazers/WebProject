const staticCacheName = "static-v1.0.1";
const dynamicCacheName = "dynamic-v1.0.1";
const assets = [
  "/",
  "/FrontEnd/app.js",
  "/FrontEnd/css/sb-admin-2.min.css",
  "/FrontEnd/icon/apple-icon-144x144-dunplab-manifest-33021.png",
  "/FrontEnd/img/icon-menu-lateral.png",
  "/FrontEnd/index.html",
  "/FrontEnd/js/sb-admin-2.min.js",
  "/FrontEnd/forgot-password.html",
  "/FrontEnd/img/icone.jpg",
  "/FrontEnd/img/pol%20mar.png",
  "/FrontEnd/manifest.json",
  "/FrontEnd/vendor/bootstrap/js/bootstrap.bundle.min.js",
  "/FrontEnd/vendor/fontawesome-free/css/all.min.css",
  "/FrontEnd/vendor/jquery-easing/jquery.easing.min.js",
  "/FrontEnd/vendor/jquery/jquery.min.js",
  "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
  "https://fonts.gstatic.com/s/nunito/v16/XRXV3I6Li01BKofINeaBTMnFcQ.woff2",
  "/fallback.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//fetch event
self.addEventListener("fetch", (evt) => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              //check cached items size
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        return caches.match("/fallback.html");
      })
  );
});
