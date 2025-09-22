import ThemeToggle from "@/Component/ThemeToggle";
import "./globals.css";
import type { Metadata } from "next";
import { Unbounded } from "next/font/google";

import Header from "@/Component/Header/Header";
export const metadata: Metadata = {
  title: "Tailwind v4 Dark Mode",
  description: "Manual toggle with Tailwind v4",
};

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400","700","900"] });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body  className={unbounded.className}>
        <Header />
        {/* <header className="p-4 flex justify-end">
        </header> */}
        <main className="mt-[4rem]">{children}</main>
      </body>
    </html>
  );
}
