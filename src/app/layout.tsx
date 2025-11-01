import "@/style/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import HeaderGate from "@/components/Header/HeaderGate";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panel | Alper Tuna Ozkan ",
  description: "Alper Tuna Ozkan || Panel",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"
  ),
  icons: [
    {
      rel: "icon",
      url: "/ico/favicon-16x16.ico",
      sizes: "16x16",
      type: "image/x-icon",
    },
    {
      rel: "icon",
      url: "/ico/favicon-32x32.ico",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      rel: "icon",
      url: "/ico/favicon-48x48.ico",
      sizes: "48x48",
      type: "image/x-icon",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <HeaderGate />
          <main>{children}</main>
          <Toaster
            closeButton
            richColors
            position="top-center"
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
