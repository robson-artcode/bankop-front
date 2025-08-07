import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider"
import { ColorModeProvider } from "@/components/ui/color-mode";
import "./globals.css";

export const metadata: Metadata = {
  title: "BankOp - Your Bank of Operations & Points",
  description: "Gerenciamento financeiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ColorModeProvider>
          <Provider>
            {children}
          </Provider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
