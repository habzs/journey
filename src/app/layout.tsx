import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import Header from "./components/Header";
import WidthLayout from "./layouts/WidthLayout";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Journey",
  description: "Volunteering gamified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <Header />
          <Toaster
            position="top-center"
            className="my-[var(--header-height)]"
            richColors
          />
          <WidthLayout>
            <ProtectedRoute>{children}</ProtectedRoute>
          </WidthLayout>
        </Providers>
      </body>
    </html>
  );
}
