import type { Metadata } from "next";
import { fontSans, fontHeading } from "@/config/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpGr8 - Hockey Training Management",
  description: "Professional hockey training management platform for coaches and teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
