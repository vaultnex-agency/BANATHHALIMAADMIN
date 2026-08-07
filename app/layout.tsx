import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banat Haleema — Admin Dashboard",
  description: "Administrative Management Panel for Banat Haleema Luxury Abayas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
