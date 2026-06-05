import type { Metadata } from "next";
import { IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const sans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "İnvestisiya Tədqiqat Platforması",
  description: "Şəxsi investisiya tədqiqat dashboardu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={`${mono.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#06080F] text-[#F1F5F9]">
        {children}
      </body>
    </html>
  );
}
