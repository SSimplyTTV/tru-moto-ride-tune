# TruMoto Controller App - Deployment Guide

## Overview

Your TruMoto Controller app is built using React + Capacitor, providing native mobile capabilities while maintaining a single codebase for web, iOS, and Android.

## Prerequisites

### Development Environment Setup

#### For iOS Development:
- **macOS** (required for iOS development)
- **Xcode 14+** (download from Mac App Store)
- **iOS 15+ device or simulator**
- **Apple Developer Account** (for real device testing and App Store deployment)

#### For Android Development:
- **Android Studio** (Windows, macOS, or Linux)
- **Android SDK** with API level 22 or higher
- **Java 11+** or **Android Studio's bundled JDK**

#### Common Requirements:
- **Node.js 16+**
- **npm** or **yarn**

## Step-by-Step Deployment

### 1. Export and Setup Project

1. **Export to GitHub** using the button in Lovable
2. **Clone the repository** locally:
   ```bash
   git clone <your-github-repo-url>
   cd tru-moto-ride-tune
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

### 2. Add Mobile Platforms

```bash
# Add iOS platform (macOS only)
npx cap add ios

# Add Android platform  
npx cap add android
```

### 3. Configure Bluetooth Permissions

#### iOS Permissions (ios/App/App/Info.plist)
Add these permissions to your Info.plist:

```xml
<dict>
  <!-- Existing keys... -->
  
  <!-- Bluetooth permissions -->
  <key>NSBluetoothAlwaysUsageDescription</key>
  <string>TruMoto app needs Bluetooth to connect to your e-bike controller</string>
  
  <key>NSBluetoothPeripheralUsageDescription</key>
  <string>TruMoto app uses Bluetooth to communicate with your e-bike controller</string>
  
  <!-- iOS 13+ Central role permission -->
  <key>NSBluetoothAlwaysUsageDescription</key>
  <string>TruMoto app needs Bluetooth to connect to your e-bike controller for tuning and telemetry</string>
</dict>
```

#### Android Permissions (android/app/src/main/AndroidManifest.xml)
Add these permissions:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <!-- Bluetooth permissions -->
  <uses-permission android:name="android.permission.BLUETOOTH" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  
  <!-- Android 12+ permissions -->
  <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
  <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
  
  <!-- Feature declaration -->
  <uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>
  
  <application>
    <!-- Your app config -->
  </application>
</manifest>
```

### 4. Build and Sync

```bash
# Build the web app
npm run build

# Sync changes to native platforms
npx cap sync
```

### 5. iOS Development and Deployment

#### Development Testing:
```bash
# Open in Xcode
npx cap open ios
```

In Xcode:
1. **Select your development team** in the project settings
2. **Choose a device or simulator** 
3. **Click Run** to build and install

#### App Store Deployment:

1. **Create App Store Connect record:**
   - Login to [App Store Connect](https://appstoreconnect.apple.com/)
   - Create new app with bundle ID: `app.lovable.fec25ac29793450fb2e64be18573b65a`

2. **Configure signing in Xcode:**
   - Select "Automatically manage signing"
   - Choose your development team
   - Ensure bundle ID matches App Store Connect

3. **Build for release:**
   - Product → Archive
   - Distribute App → App Store Connect
   - Upload to App Store Connect

4. **Submit for review:**
   - Configure app metadata in App Store Connect
   - Submit for App Store review

### 6. Android Development and Deployment

#### Development Testing:
```bash
# Open in Android Studio
npx cap open android
```

In Android Studio:
1. **Wait for Gradle sync** to complete
2. **Select a device or emulator**
3. **Click Run** to build and install

#### Google Play Store Deployment:

1. **Generate signed APK/AAB:**
   - Build → Generate Signed Bundle/APK
   - Create new keystore (save securely!)
   - Generate release bundle (.aab file)

2. **Upload to Google Play Console:**
   - Login to [Google Play Console](https://play.google.com/console/)
   - Create new app
   - Upload your .aab file
   - Configure store listing, content rating, pricing

3. **Submit for review:**
   - Complete all required sections
   - Submit for review

### 7. Testing BLE Functionality

#### iOS Testing:
- **Physical device required** (BLE doesn't work in simulator)
- Enable location services for the app
- Make sure Bluetooth is enabled

#### Android Testing:
- **Physical device required** (BLE doesn't work in emulator)
- Grant location and Bluetooth permissions
- Enable location services

### 8. Updating the App

When you make changes in Lovable:

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Build and sync:**
   ```bash
   npm run build
   npx cap sync
   ```

3. **Test and deploy** using the same process above

## Common Issues and Troubleshooting

### BLE Connection Issues:
- **Permissions not granted:** Check iOS Settings → Privacy → Bluetooth
- **Location services disabled:** BLE requires location on Android
- **Background app refresh:** Enable in iOS settings for better connectivity

### Build Issues:
- **Xcode version:** Ensure Xcode 14+ for iOS 15+ support
- **Android SDK:** Verify Android SDK is properly installed
- **Capacitor sync:** Always run `npx cap sync` after web changes

### App Store Rejections:
- **Missing usage descriptions:** Ensure all permission strings are descriptive
- **Functionality testing:** Test all features thoroughly before submission
- **App metadata:** Complete all required App Store Connect fields

## Web Version Deployment

Your app also works as a Progressive Web App (PWA):

```bash
# Build for web
npm run build

# Deploy to any static hosting service
# (Netlify, Vercel, Firebase Hosting, etc.)
```

The web version has some limitations:
- **No native BLE access** (Web Bluetooth has limited support)
- **Limited offline capabilities**
- **No app store distribution**

## Support Resources

- **Capacitor Documentation:** https://capacitorjs.com/docs
- **BLE Plugin Documentation:** https://github.com/capacitor-community/bluetooth-le
- **iOS Development:** https://developer.apple.com/documentation/
- **Android Development:** https://developer.android.com/docs

## Next Steps

1. **Test thoroughly** on real devices
2. **Implement error handling** for BLE edge cases
3. **Add analytics** for usage tracking
4. **Consider implementing** push notifications for firmware updates
5. **Plan for** over-the-air updates using Capacitor Live Updates

Your TruMoto Controller app is now ready for mobile deployment! 🚀
