import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerador de Códigos de Barras",
  description: "Gere códigos de barras sequenciais em PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
