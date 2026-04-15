import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { EventModalProvider } from "@/contexts/EventModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Statement Academy - Excelência em Educação Profissional",
  description: "Transformando vidas através da educação de qualidade e inovação contínua",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <ContactModalProvider>
          <EventModalProvider>
            <Navigation />
            {children}
            <Footer />
          </EventModalProvider>
        </ContactModalProvider>
      </body>
    </html>
  );
}
