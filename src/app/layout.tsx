import "@/style/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import HeaderGate from "@/components/Header/HeaderGate";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

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
