import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Green Kids Hub Learning Portal',
  description: 'Educational gaming, homework, analytics, and role-based learning portal.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
