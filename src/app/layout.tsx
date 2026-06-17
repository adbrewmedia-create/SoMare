import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Racing Engine',
  description: 'Festival pick\'em game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
