import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Satyam Tiwari | Terminal Portfolio",
  description: "Passionate Web Developer & Computer Science Student. Explore my work through an interactive terminal interface.",
  keywords: ["Satyam Tiwari", "developer", "portfolio", "React", "Frontend", "Terminal", "Web Developer"],
  authors: [{ name: "Satyam Tiwari" }],
  openGraph: {
    title: "Satyam Tiwari | Terminal Portfolio",
    description: "Passionate Web Developer & Computer Science Student. Explore my work through an interactive terminal interface.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satyam Tiwari | Terminal Portfolio",
    description: "Passionate Web Developer & Computer Science Student. Explore my work through an interactive terminal interface.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
