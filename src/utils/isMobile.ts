export function isMobile() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  // Basic mobile detection (iOS, Android, iPad)
  return /android|iphone|ipad|ipod|iemobile|mobile/i.test(ua);
}

export function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}
