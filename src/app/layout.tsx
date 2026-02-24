import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mektup – Kalpten Özür Mektupları',
  description:
    'Duygularını en güzel şekilde ifade et. El yazısı hissi veren, çiçeklerle süslenmiş özür mektupları yaz.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='tr'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
