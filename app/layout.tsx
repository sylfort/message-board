import "@/styles/globals.css"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="container mx-auto py-6">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'