import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "BankOp - Seu banco de Operações e Pontos",
  description: "Gerenciamento financeiro",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1E40AF" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
