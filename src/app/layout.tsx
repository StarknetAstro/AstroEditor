import type { Metadata } from "next";

import "./globals.css";
import {ThemeProvider} from "next-themes";
import { GoogleAnalytics } from '@next/third-parties/google'
import React from "react";


export const metadata: Metadata = {
  title: "Astro Editor: A Web Assembly Editor for Cairo",
  description: "Astro Editor: A Web Assembly Editor for Cairo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
          >
              {children}
          </ThemeProvider>
          <GoogleAnalytics gaId="G-KMNYTQF108" />
      </body>
    </html>
  );
}
