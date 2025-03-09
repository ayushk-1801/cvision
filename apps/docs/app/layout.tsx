import "./globals.css";
import { GeistSans } from 'geist/font/sans';

export const metadata = {
  title: 'CVision Recruiter',
  description: 'Computer Vision Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  );
}
