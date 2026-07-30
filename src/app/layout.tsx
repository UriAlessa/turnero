import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/providers/session-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Turnero | Reservas simples para tu negocio",
  description:
    "Una plataforma simple para que los negocios organicen sus turnos online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Toaster position="bottom-right" richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
