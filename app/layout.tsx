import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'


const myFont = localFont({
  src: '../public/fonts/AppleSDGothicNeoEB.ttf',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Build blocks",
  description: "도형을 쌓아서 그림을 그려보자",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
