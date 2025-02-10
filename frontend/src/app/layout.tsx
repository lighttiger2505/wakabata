import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react"; // Added import for React
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WakabaTa - Nurture Your Tasks",
  description: "A todo app for growing your productivity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-gray-900 text-gray-100`}>
        <Header />
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
