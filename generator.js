const workbox = require("workbox-build");

workbox.generateSW({
    cacheId: "pwa-example",
    globDirectory: "./",
    globPatterns: [
        "**/*.{css,js}"
    ],
    globIgnores: [
        "**/generator.js",
        "**/sw.js",
        "node_modules/**/*"
    ],
    swDest: "./sw.js",
    runtimeCaching: [
        {
            urlPattern: /\.(?:html)$/,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "markup"
            }
        }
    ]
})