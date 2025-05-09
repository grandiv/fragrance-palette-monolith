import type { Metadata } from "next";
import "./globals.css";
import ClientSessionProvider from "@/app/components/ClientSessionProvider";
import { Nav } from "./components/Nav";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ClientSessionProvider>
          <header className="p-4 bg-white shadow">
            <Nav />
            <h1 className="text-xl font-bold">Fragrance-Palette</h1>
          </header>
          <main className="p-4">{children}</main>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
