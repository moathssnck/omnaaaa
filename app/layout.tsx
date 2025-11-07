import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سجل الدخول ",
  description: "  الخاص بك  أدخل رقما صحيحا تسجيل الدخول",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
