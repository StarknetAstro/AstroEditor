import type { Metadata } from "next";

import "./globals.css";
import {ThemeProvider} from "next-themes";
import { Analytics } from '@vercel/analytics/react';
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
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
              {children}
          </ThemeProvider>
          <Analytics/>
      </body>
    </html>
  );
}
