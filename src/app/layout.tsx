import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mektup – Heartfelt Letters, Beautifully Written',
  description:
    'Write meaningful letters for every occasion — apology, love, thank you, birthday, and more. Decorate with flowers, save, and share a beautiful private link.',
  keywords: [
    'apology letter',
    'love letter',
    'thank you letter',
    'heartfelt letter writer',
    'letter generator',
    'sympathy letter',
    'pen pal letter',
  ],
  openGraph: {
    title: 'Mektup – Heartfelt Letters, Beautifully Written',
    description:
      'Write meaningful letters for every occasion. Decorate with flowers, save, and share a beautiful private link.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&family=Dancing+Script:wght@400;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
