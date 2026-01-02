import React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Launchbelt Network Ops",
  description: "A production-grade aerospace supply chain and engineering operations platform for secure RFI/RFQ management, technical data packages, and quality traceability.",
};

export default function RootLayout({
  children,
}: {
  // Fix: Explicitly using React.ReactNode requires React to be imported in the file scope
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
