export function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  
  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: 25,
    heavy: 50,
  };
  
  try {
    navigator.vibrate(patterns[style]);
  } catch {
    // Vibration not supported
  }
}

export function triggerSuccessHaptic() {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  
  try {
    navigator.vibrate([50, 50, 50]);
  } catch {
    // Vibration not supported
  }
}

export function triggerErrorHaptic() {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  
  try {
    navigator.vibrate([100, 50, 100]);
  } catch {
    // Vibration not supported
  }
}
