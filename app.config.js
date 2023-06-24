
import "dotenv/config"
export default {
    expo: {
        name: "Terratrack",
        slug: "terratrack",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#1A162A"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: false
        },
        android: {
            icon: "./assets/icon.png",
            package: "com.tudor14abw.terratrack",
            permissions: [
                "ACCESS_FINE_LOCATION",
                "ACCESS_COARSE_LOCATION"
            ]
        },
        web: {
            favicon: "./assets/terratrack.png"
        },
        plugins: [
            [
                "@rnmapbox/maps",
                {
                    RNMapboxMapsImpl: "mapbox",
                    RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN
                }
            ]
        ],
        extra: {
            eas: {
                projectId: "611c0648-6e8d-421d-aa28-a2dfb0f5a1d8"
            },
            MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
            MAPBOX_DOWNLOAD_TOKEN: process.env.MAPBOX_DOWNLOAD_TOKEN,
            TOPOGRAPHIC_URL: process.env.TOPOGRAPHIC_URL,
            SATELLITE_URL: process.env.SATELLITE_URL,
            SENTRY_DSN: process.env.SENTRY_DSN,
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_KEY: process.env.SUPABASE_KEY,
            CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY
        }
    }
};