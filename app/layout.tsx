import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NaijaSpots — Discover Nigeria's Best Spots",
  description:
    "Explore the best hangout spots, restaurants, bars, and landmarks across Nigeria.",
  manifest: "/manifest.json",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇳🇬</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased h-[100dvh] max-h-[100dvh] overflow-hidden bg-sky-gradient text-slate-900 flex flex-col items-center justify-start`}>
        <div className="w-full max-w-md h-full flex flex-col bg-transparent shadow-2xl relative overflow-hidden">
          {children}
        </div>
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e0f2fe",
              boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.15)",
              borderRadius: "16px",
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  );
}
