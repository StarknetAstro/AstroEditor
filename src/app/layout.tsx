import type { Metadata } from "next";

import "./globals.css";
import {ThemeProvider} from "next-themes";
import { GoogleAnalytics } from '@next/third-parties/google'
import React from "react";
import {OpenpanelProvider} from "@openpanel/nextjs";


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
          <OpenpanelProvider
              clientId="265f0bfc-cbd5-4f47-8feb-3713493fe25b"
              trackScreenViews={true}
              trackAttributes={true}
              trackOutgoingLinks={true}
              // If you have a user id, you can pass it here to identify the user
              // profileId={'123'}
          />
      </body>
    </html>
  );
}
