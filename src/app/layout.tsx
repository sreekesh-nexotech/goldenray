// src/app/layout.tsx
import Header from '@/components/ui/Header';
import '@/styles/globals.css';
import Footer from '@/components/ui/Footer';


export const metadata = {
  title: 'GoldenRay',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Switzer:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header/>
        {children}           {/* Pages will add their own hero */}
        <Footer/>
      </body>
    </html>
  );
}
