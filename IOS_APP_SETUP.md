# iOS App Setup Guide for Age The Player

This guide will help you build and submit your app to the Apple App Store.

## Prerequisites

1. **Apple Developer Account** - You need an active Apple Developer Program membership ($99/year)
2. **Mac with Xcode** - You must have a Mac with Xcode installed (latest version recommended)
3. **Node.js** - Install Node.js on your Mac if not already installed

## Step 1: Download the Project

Download/clone this project to your Mac.

## Step 2: Install Dependencies

Open Terminal in the project folder and run:

```bash
npm install
```

## Step 3: Build the Web App

Build the production version of the web app:

```bash
npm run build
```

## Step 4: Initialize iOS Project

Run these Capacitor commands:

```bash
npx cap sync ios
npx cap open ios
```

This will open the project in Xcode.

## Step 5: Configure in Xcode

1. **Bundle Identifier**: Change to your unique bundle ID (e.g., `com.yourcompany.agetheplayer`)
2. **Team**: Select your Apple Developer team
3. **Signing**: Enable "Automatically manage signing"
4. **Display Name**: Set to "Age The Player"

## Step 6: Add App Icons

The app icon has been generated at: `attached_assets/generated_images/football_quiz_app_icon.png`

1. In Xcode, open `ios/App/App/Assets.xcassets/AppIcon.appiconset`
2. Use an icon generator tool (like https://appicon.co) to create all required sizes from the generated icon
3. Replace the placeholder icons with your generated icons

### Required Icon Sizes for iOS:
- 20pt: 40x40, 60x60
- 29pt: 58x58, 87x87
- 40pt: 80x80, 120x120
- 60pt: 120x120, 180x180
- 76pt: 152x152
- 83.5pt: 167x167
- 1024pt: 1024x1024 (App Store)

## Step 7: Configure App Info

In Xcode, update `Info.plist`:

1. Set `CFBundleDisplayName` to "Age The Player"
2. Add required privacy descriptions if needed

## Step 8: Test on Simulator/Device

1. Select an iOS Simulator or connected device
2. Press the Play button (⌘+R) to build and run
3. Test all functionality

## Step 9: Archive and Submit

1. Select "Any iOS Device" as the build target
2. Go to Product > Archive
3. Once archived, open Window > Organizer
4. Click "Distribute App"
5. Follow the prompts to submit to App Store Connect

## Step 10: App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app with your Bundle ID
3. Fill in all required metadata:
   - App name: Age The Player
   - Description: Test your football knowledge! Guess the ages of famous professional footballers in this fun quiz game.
   - Keywords: football, soccer, quiz, game, age, player, trivia
   - Category: Games > Trivia
   - Age Rating: 4+
4. Upload screenshots for all required device sizes
5. Submit for review

## Updating the App

When you make changes to the web app:

1. Run `npm run build` to rebuild
2. Run `npx cap sync ios` to sync changes
3. Open Xcode and create a new build

## Troubleshooting

### Build fails with signing errors
- Ensure you've selected your Apple Developer team
- Enable "Automatically manage signing"

### White screen on launch
- Check that the build completed successfully
- Verify `dist/public` folder exists with your built files

### Plugins not working
- Run `npx cap sync` to ensure plugins are properly linked
