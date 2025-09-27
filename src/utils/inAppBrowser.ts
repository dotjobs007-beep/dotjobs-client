export function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // common in-app browsers: Twitter, Facebook, Instagram, LinkedIn, Snapchat, TikTok
  return /FBAN|FBAV|Instagram|Twitter|Line|LinkedIn|Snapchat|TikTok|WeChat|Pinterest/i.test(ua);
}
