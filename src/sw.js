const CACHE_NAME = "threshtime-v1"

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./img/hourglass.svg",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./scripts/main.js",
  "./scripts/threshtime.js"
]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", event => {
  const request = event.request

  if(request.method !== "GET")
    return

  event.respondWith(
    caches.match(request).then(cached => {
      if(cached)
        return cached

      return fetch(request)
        .then(response => {
          if(response && response.status === 200) {
            const copy = response.clone()

            caches.open(CACHE_NAME).then(cache => cache.put(request, copy))
          }

          return response
        })
        .catch(() => {
          if(request.mode === "navigate")
            return caches.match("./index.html")

          return Response.error()
        })
    })
  )
})
