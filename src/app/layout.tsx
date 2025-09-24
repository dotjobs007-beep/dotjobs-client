import ThemeToggle from "@/Component/ThemeToggle";
import "./globals.css";
import type { Metadata } from "next";
import { Unbounded } from "next/font/google";

import Header from "@/Component/Header/Header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authcontext";
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
        <AuthProvider>
        <Header />
        {/* <header className="p-4 flex justify-end">
        </header> */}
        <main className="mt-[4rem]">
          {children}
         <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: "#22c55e", // Tailwind green-500
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444", // Tailwind red-500
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
          }}
        />
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}
