"use client";
import { useAuth } from "@/app/context/authcontext";
import Card from "@/Component/Card";
import service from "@/helper/service.helper";
import { IApiResponse, IUserDetails } from "@/interface/interface";
import { Wallet } from "lucide-react";
import router from "next/dist/shared/lib/router/router";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast/headless";
export default function VerifyIdentity() {
  const router = useRouter();
  const {
    isLoggedIn,
    isWalletConnected,
    userDetails,
    ctxWalletAddress,
    setUserDetails,
  } = useAuth();
  if (!isLoggedIn) {
    router.push("/auth/signin");
    return;
  }

  const [isLoading, setIsLoading] = useState(false);

  // 👉 Fetch user profile
  const fetchUserData = async () => {
    setIsLoading(true);
    const res: IApiResponse<IUserDetails> = await service.fetcher(
      "/user/profile",
      "GET"
    );

    if (res.code === 401) {
      router.push("/auth/signin");
      return;
    }

    if (res.status === "error") {
      toast.error(res.message);
      return;
    }
    setUserDetails(res.data || null);
    return res.data;
  };

  useEffect(() => {
    fetchUserData();
  }, [ctxWalletAddress]);

  return (
    <div>
      {isLoggedIn && isWalletConnected && ctxWalletAddress && !userDetails?.verified_onchain &&(
        <Card className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          <h1 className="lg:text-2xl md:text-2xl text-l font-bold mb-4">
            Verify Your Identity
          </h1>
          <p className="text-center mb-6">Build trust with onchain identity</p>

          <Link
            href="https://app.polkaidentity.com/"
            target="_blank"
            className="flex items-center border p-3 rounded-lg mt-4 cursor-pointer"
          >
            <Image
              src="https://res.cloudinary.com/dk06cndku/image/upload/v1759530623/assembly_v5uspf.jpg"
              alt="Verify Identity"
              width={50}
              height={50}
              className="rounded-full"
            />

            <h1 className="ml-3 lg:text-[15px] md:text-[15px] text-[12px]">
              Verify with Polka Identity
            </h1>
          </Link>

          <Link
            href="https://polkadot.polkassembly.io/"
            target="_blank"
            className="flex items-center mt-4 cursor-pointer"
          >
            <div className="flex items-center border p-3 rounded-lg mt-4 cursor-pointer">
              <Image
                src="https://res.cloudinary.com/dk06cndku/image/upload/v1759530665/identity_wcsogn.jpg"
                alt="Verify Identity"
                width={50}
                height={50}
                className="rounded-full"
              />

              <h1 className="ml-3 lg:text-[15px] md:text-[15px] text-[12px]">
                Verify with Polkassembly
              </h1>
            </div>
          </Link>
        </Card>
      )}

      {(!isWalletConnected || !ctxWalletAddress) && (
        <WalletConnectionNotification />
      )}

      {isLoggedIn &&
        isWalletConnected &&
        ctxWalletAddress &&
        userDetails?.verified_onchain && <WalletAlreadyVerified />}
    </div>
  );
}

export function WalletConnectionNotification() {
  const { polkadotWalletConnect, connectingWallet } = useAuth();
  return (
    <Card className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <Wallet className="mb-4" size={50} />
      <h1 className="lg:text-2xl md:text-2xl text-l font-bold mb-4">
        Connect Your Polkadot Wallet
      </h1>
      <p className="text-center">
        Please connect your Polkadot wallet to verify your identity.
      </p>

      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={polkadotWalletConnect}
        disabled={connectingWallet}
      >
        {connectingWallet ? "Connecting..." : "Connect Wallet"}
      </button>
    </Card>
  );
}

export function WalletAlreadyVerified() {
  const router = useRouter();
  return (
    <Card className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <Wallet className="mb-4" size={50} />
      <h1 className="lg:text-2xl md:text-2xl text-l font-bold mb-4">
        Wallet Already Verified
      </h1>
      <p className="text-center">
        Your Polkadot wallet is already connected and verified ✅.
      </p>

      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </Card>
  );
}
