import './globals.css';

export const metadata = {
  title: 'ID Card PT DAHLIA',
  description: 'ID Card dengan QR dan validasi otomatis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-green-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
