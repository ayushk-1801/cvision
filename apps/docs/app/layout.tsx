import "./globals.css";
import { GeistSans } from 'geist/font/sans';

export const metadata = {
  title: 'JobWise Recruiter',
  description: 'Job Matching Platform',
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
