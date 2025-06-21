import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crabtree Bay Studio - Handcrafted Goods",
  description: "Handcrafted goods made with love. Each piece tells a story of coastal inspiration and artisan craftsmanship.",
  keywords: "handcrafted, artisan, coastal, handmade, crafts",
  authors: [{ name: "Lora and Ken" }],
  openGraph: {
    title: "Crabtree Bay Studio - Handcrafted Goods",
    description: "Handcrafted goods made with love in Maryland",
    url: "https://crabtreestudio.com",
    siteName: "Crabtree Bay Studio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          <Layout>
            {children}
          </Layout>
        </CartProvider>
      </body>
    </html>
  );
}