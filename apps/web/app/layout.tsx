import "./globals.css";

export const metadata = {
  title: 'CVision',
  description: 'Computer Vision Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
