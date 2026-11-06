import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alma Cigana · Joias e Acessórios",
  description:
    "Loja de joias e acessórios com alma: colares, braceletes, anéis e brincos em dourado. Compre online com frete grátis acima de R$ 199 e atendimento pessoal pelo WhatsApp.",
  keywords: ["Alma Cigana", "joias", "acessórios", "semijoias", "colares", "anéis", "brincos", "pulseiras"],
  authors: [{ name: "Alma Cigana" }],
  openGraph: {
    title: "Alma Cigana · Joias e Acessórios",
    description: "Joias e acessórios com alma: marsala e dourado, lua, estrela e rosa.",
    siteName: "Alma Cigana",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
