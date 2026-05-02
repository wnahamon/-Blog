import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; // ← Импортируй хедер

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Блог",
  description: "Блог о чем-то",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Header /> {/* ← Вставь сюда */}
        {children}
      </body>
    </html>
  );
}