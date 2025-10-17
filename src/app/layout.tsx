import "./globals.css";
import type { Metadata } from "next";
import { Unbounded } from "next/font/google";

import Header from "@/Component/Header/Header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authcontext";
import Script from "next/script";
import { JobProvider } from "./context/jobcontext";
import { UserProvider } from "./context/usercontext";
import Footer from "@/Component/Footer/Footer";
export const metadata: Metadata = {
  title: "Dotjobs - Your Gateway to Remote Opportunities",
  description: "Find your dream remote job today! Explore thousands of listings, apply with ease, and take your career global with Dotjobs.",
};

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${unbounded.className} min-h-screen relative`}>
        <AuthProvider>
          <JobProvider>
            <UserProvider>
              <Header />
              {/* <header className="p-4 flex justify-end">
        </header> */}
              <main className="mt-[4rem] min-h-[calc(80vh)]">
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

                {/* Load Eruda only in development */}
                {process.env.NODE_ENV === "development" && (
                  <>
                    <Script
                      src="https://cdn.jsdelivr.net/npm/eruda"
                      strategy="beforeInteractive"
                    />
                    <Script id="eruda-init" strategy="beforeInteractive">
                      {`eruda.init();`}
                    </Script>
                  </>
                )}
              </main>
            </UserProvider>
          </JobProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
