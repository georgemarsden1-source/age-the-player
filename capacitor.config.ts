import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agetheplayer.app',
  appName: 'Age The Player',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: 'https://football-age--georgemarsden.replit.app',
    cleartext: false
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;
