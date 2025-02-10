import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "WakabaTa - Nurture Your Tasks",
  description: "A todo app for growing your productivity",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100 flex flex-col min-h-screen`}>
        <Header />
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

