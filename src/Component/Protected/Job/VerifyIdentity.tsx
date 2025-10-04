"use client";
import { useAuth } from "@/app/context/authcontext";
import Card from "@/Component/Card";
import { Car } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";
import Image from "next/image";
import Link from "next/link";
export default function VerifyIdentity() {
  const router = useRouter();
  const { isLoggedIn, isWalletConnected } = useAuth();
  if (!isLoggedIn) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div>
      {isLoggedIn && isWalletConnected ? (
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
      ) : <WalletConnectionNotification />}
    </div>
  );
}


export function WalletConnectionNotification() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <Car className="mb-4" size={50} />
      <h1 className="lg:text-2xl md:text-2xl text-l font-bold mb-4">
        Connect Your Wallet
      </h1>
      <p className="text-center">
        Please connect your wallet to verify your identity and proceed with job
        applications.
      </p>
    </Card>
  )
}