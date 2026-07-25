import type { Metadata } from "next";
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
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
