import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Kaif's Portfolio",
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen w-full lg:w-[67%] mx-auto">
          {children}
        </div>
      </body>
    </html>
  )
}
