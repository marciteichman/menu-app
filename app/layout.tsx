import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Breakfast Menu",
  description: "A visual breakfast menu for kids"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
