import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bases de Datos Abiertas para Compuestos Biológicos',
  description: 'Plataforma Integrada de Bases de Datos Abiertas para Compuestos Biológicos - Proyecto de Prácticum II por Karen Franco.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30`}>
        {children}
      </body>
    </html>
  );
}
