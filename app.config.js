
import "dotenv/config"

const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN
const MAPBOX_DOWNLOAD_TOKEN = process.env.MAPBOX_DOWNLOAD_TOKEN
const TOPOGRAPHIC_URL = process.env.TOPOGRAPHIC_URL
const SATELLITE_URL = process.env.SATELLITE_URL
const SENTRY_DSN = process.env.SENTRY_DSN
export default {
    expo: {
        name: "terratrack",
        slug: "terratrack",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true
        },
        android: {
            icon: "./assets/icon.png",
            package: "com.tudor14abw.terratrack"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            [
                "@rnmapbox/maps",
                {
                    RNMapboxMapsImpl: "mapbox",
                    RNMapboxMapsDownloadToken: MAPBOX_DOWNLOAD_TOKEN
                }
            ]
        ],
        extra: {
            eas: {
                projectId: "611c0648-6e8d-421d-aa28-a2dfb0f5a1d8"
            },
            MAPBOX_ACCESS_TOKEN: ACCESS_TOKEN,
            MAPBOX_DOWNLOAD_TOKEN: MAPBOX_DOWNLOAD_TOKEN,
            TOPOGRAPHIC_URL: TOPOGRAPHIC_URL,
            SATELLITE_URL: SATELLITE_URL,
            SENTRY_DSN: SENTRY_DSN
        }
    }
};