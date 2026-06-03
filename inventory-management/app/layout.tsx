import "./globals.css";

export const metadata = {
  title: "Inventory Management",
  description: "Inventory and Order Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}