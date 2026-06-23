import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Zohar Décor — Formation Professionnelle en Résine Époxy",
  description:
    "Inscrivez-vous à la Formation Professionnelle en Résine Époxy de Zohar Décor. 3 jours intensifs, 10 places seulement, du 09 au 11 juillet 2026. Des souvenirs qui brillent à jamais.",
  keywords: [
    "Zohar Décor",
    "résine époxy",
    "formation résine",
    "formation professionnelle",
    "porte-clés résine",
    "stylos personnalisés",
    "bijoux résine",
    "tableaux décoratifs",
    "Cotonou",
    "Bénin",
    "inscription formation",
  ],
  authors: [{ name: "Zohar Décor" }],
  icons: {
    icon: "/favicon.png",
    apple: "/logo_zohar_decor.png",
  },
  openGraph: {
    title: "Zohar Décor — Formation Professionnelle en Résine Époxy",
    description:
      "3 jours intensifs, 10 places seulement. Du 09 au 11 juillet 2026. Apprenez à créer et vendre des créations personnalisées en résine époxy.",
    siteName: "Zohar Décor",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/logo_zohar_decor.png", width: 600, height: 600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zohar Décor — Formation Résine Époxy",
    description: "Des souvenirs qui brillent à jamais.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
