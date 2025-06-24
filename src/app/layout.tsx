import type { Metadata } from "next";
import { Roboto_Slab, Work_Sans } from "next/font/google";
import "./globals.css";
import '../styles/woodworker-theme.css'
import { CartProvider } from "@/hooks/useCart";
import Layout from "@/components/Layout";

const robotoSlab = Roboto_Slab({ 
  subsets: ['latin'],
  variable: '--font-heading'
})

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-body'
});

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${robotoSlab.variable} ${workSans.variable} antialiased`}>
        <CartProvider>
          <Layout>
            {children}
          </Layout>
        </CartProvider>
      </body>
    </html>
  );
}