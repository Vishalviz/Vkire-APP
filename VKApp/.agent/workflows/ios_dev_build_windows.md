---
description: How to run on iOS device without Expo Go (Development Build)
---

# Running on iOS Device without Expo Go (Windows User)

Since you are on Windows, you cannot compile the iOS app locally (this requires a Mac with Xcode). Instead, you must use **EAS Build** (Expo Application Services) to build the app in the cloud.

To run the app on your physical iOS device without Expo Go, you need to create a **Development Build**.

## Prerequisites

1.  **Expo Account**: You need to be logged in to Expo.
2.  **Apple Developer Account**: 
    *   **CRITICAL**: To install a build on your iOS device from Windows (via EAS), you generally need a **Paid Apple Developer Program membership ($99/year)**.
    *   *Why?* You need to register your device's UDID and create an Ad Hoc provisioning profile. Free accounts have significant limitations that make cloud building for devices difficult or impossible without a Mac.

## Steps

1.  **Install EAS CLI**:
    ```powershell
    npm install -g eas-cli
    ```

2.  **Login to EAS**:
    ```powershell
    eas login
    ```

3.  **Configure the Project**:
    ```powershell
    eas build:configure
    ```
    *   Select `iOS`.
    *   This creates an `eas.json` file.

4.  **Create a Development Build**:
    ```powershell
    eas build --profile development --platform ios
    ```
    *   You will be prompted to log in to your Apple ID.
    *   You will be asked to register your device (you'll need to get your iPhone's UDID).

5.  **Install the Build**:
    *   Once the cloud build finishes, you will get a QR code or link.
    *   Scan it with your camera to install the "Development Build" of your app.
    *   This app looks like your app (has your icon/name) but includes tools to load your Metro bundler.

6.  **Run the Development Server**:
    ```powershell
    npx expo start --dev-client
    ```
    *   Open your custom app on the phone.
    *   It should connect to your computer's server (ensure both are on the same Wi-Fi).
