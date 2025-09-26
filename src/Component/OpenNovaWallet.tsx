"use client";
export function openInNovaWallet() {
  // Replace with your real dApp URL
  const dappUrl = encodeURIComponent("https://dotjob-i4y3.onrender.com");
  window.location.href = `https://app.novawallet.io/open?url=${dappUrl}`;
}
