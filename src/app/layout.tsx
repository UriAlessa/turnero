import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

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
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
