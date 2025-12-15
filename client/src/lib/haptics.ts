import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export async function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (isNative) {
    const impactStyle = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy
    }[style];
    
    try {
      await Haptics.impact({ style: impactStyle });
    } catch {
    }
  } else {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      const patterns: Record<string, number> = {
        light: 10,
        medium: 25,
        heavy: 50,
      };
      try {
        navigator.vibrate(patterns[style]);
      } catch {
      }
    }
  }
}

export async function triggerSuccessHaptic() {
  if (isNative) {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
    }
  } else {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([50, 50, 50]);
      } catch {
      }
    }
  }
}

export async function triggerErrorHaptic() {
  if (isNative) {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
    }
  } else {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {
      }
    }
  }
}
