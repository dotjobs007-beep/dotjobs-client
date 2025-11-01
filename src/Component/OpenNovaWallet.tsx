"use client";

export type WalletType = "nova" | "subwallet" | "polkadot";

export function openWallet(wallet: WalletType) {
  // Check if we're on the client side
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    console.warn('openWallet called on server side');
    return;
  }

  const dappUrl = encodeURIComponent("https://dotjob-i4y3.onrender.com");
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isiOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);

  const openDeepLink = (scheme: string, iosStore: string, androidStore: string) => {
    if (isiOS) {
      // iOS deep link
      window.location.href = `${scheme}://open?url=${dappUrl}`;
      // fallback to App Store if not installed
      setTimeout(() => {
        window.location.href = iosStore;
      }, 2000);
    } else {
      // Android deep link
      window.location.href = `${scheme}://open?url=${dappUrl}`;
      // fallback to Play Store
      setTimeout(() => {
        window.location.href = androidStore;
      }, 1500);
    }
  };

  switch (wallet) {
    case "nova":
      openDeepLink(
        "novawallet",
        "https://apps.apple.com/ng/app/nova-polkadot-wallet/id1597119355",
        "https://play.google.com/store/apps/details?id=io.novafoundation.nova.market"
      );
      break;

    case "subwallet":
      openDeepLink(
        "subwallet",
        "https://apps.apple.com/ng/app/subwallet-polkadot-wallet/id1633050285",
        "https://play.google.com/store/apps/details?id=app.subwallet.mobile" // replace with actual link
      );
      break;

    case "polkadot":
      alert("Please use Polkadot.js extension in your browser to connect.");
      break;

    default:
      console.error("Unknown wallet type:", wallet);
      break;
  }
}
