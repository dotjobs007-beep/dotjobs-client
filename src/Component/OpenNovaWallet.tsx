"use client";

export function openInNovaWallet() {
  const dappUrl = encodeURIComponent("https://dotjob-i4y3.onrender.com");

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detection
  const isiOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);

  if (isiOS) {
    const timeout = setTimeout(() => {
      alert("Could not open Nova Wallet. Please install the app or try again.");
      window.location.href = `https://app.novawallet.io/`;
    }, 2000);

    window.location.href = `novawallet://open?url=${dappUrl}`;
  } else {
    // Android / fallback
    window.location.href = `https://app.novawallet.io/open?url=${dappUrl}`;
  }
}
