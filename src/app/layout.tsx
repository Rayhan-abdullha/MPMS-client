import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPMS Workspace",
  description: "Premium Project Management Performance Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#fafafa] text-[#18181b]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
