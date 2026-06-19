import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Frankie's Cheltenham Challenge",
  description: 'Pick your horse, jockey and trainer. Compete daily.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0a0910' }}>{children}</body>
    </html>
  );
}
