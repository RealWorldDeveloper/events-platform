import React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/authContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JV Events Platform",
  description: "Connect with your community through events",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
            </ThemeProvider >
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
