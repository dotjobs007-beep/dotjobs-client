"use client";
import Card from "@/Component/Card";
import Image from "next/image";
import Link from "next/link";
import assemblyLogo from "../../../../public/images/polkadot_assembly.png";
import polkadotIdentityLogo from "../../../../public/images/polkadot_identity.png";
export default function VerifyIdentity() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h1 className="lg:text-2xl md:text-2xl text-l font-bold mb-4">Verify Your Identity</h1>
      <p className="text-center mb-6">Build trust with onchain identity</p>

      <Link href="https://app.polkaidentity.com/" target="_blank" className="flex items-center border p-3 rounded-lg mt-4 cursor-pointer">
        <Image
          src={polkadotIdentityLogo}
          alt="Verify Identity"
          width={30}
          height={30}
        />

        <h1 className="ml-3 lg:text-[15px] md:text-[15px] text-[12px]">Verify with Polka Identity</h1>
      </Link>

      <Link href="https://polkadot.polkassembly.io/" target="_blank" className="flex items-center mt-4 cursor-pointer">
      <div className="flex items-center border p-3 rounded-lg mt-4 cursor-pointer">
        <Image
          src={assemblyLogo}
          alt="Verify Identity"
          width={30}
          height={30}
        />

        <h1 className="ml-3 lg:text-[15px] md:text-[15px] text-[12px]">Verify with Polkassembly</h1>
      </div>
      </Link>
    </Card>
  );
}
