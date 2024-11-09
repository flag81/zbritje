/// app.config.js
export default 
    {
        "expo": {
          "name": "zbritje",
          "slug": "zbritje",
          "version": "1.0.1",
          "orientation": "portrait",
          "icon": "./assets/icon.png",
          "userInterfaceStyle": "light",
          "packagerOpts": {
            "dev": false,
            "minify": true
          },
          "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
          },
          "assetBundlePatterns": [
            "**/*"
          ],
          "ios": {
            "supportsTablet": true,
            "runtimeVersion": {
              "policy": "appVersion"
            },
            "bundleIdentifier": "com.anonymous.zbritje",
            "googleServicesFile":
            process.env.GOOGLE_SERVICE_INFO || "./ios/GoogleService-Info.plist",
          },
          "android": {
            "adaptiveIcon": {
              "foregroundImage": "./assets/adaptive-icon.png",
              "backgroundColor": "#ffffff"
            },
            "package": "com.anonymous.zbritje",
            "googleServicesFile": "./android/app/google-services.json",
            "runtimeVersion": "1.0.0",
            "useNextNotificationsApi": true,
            "enableBackgroundNotification": true,
            "priority": "max"
          },
          "web": {
            "favicon": "./assets/favicon.png"
          },
          "plugins": [
            "expo-router",
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            "@react-native-firebase/messaging",
            [
            "expo-build-properties",
            {
                "ios" :{
                  "useFrameworks" : "static"
                }
              }

            ]
          ],
          "extra": {
            "router": {
              "origin": false
            },
            "eas": {
              "projectId": "c88eb3cf-54e8-4498-ba62-9fc8042554d8"
            }
          },
          "updates": {
            "url": "https://u.expo.dev/c88eb3cf-54e8-4498-ba62-9fc8042554d8"
          }
        }
      }
      

 