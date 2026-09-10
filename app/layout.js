import "./globals.css";

export const metadata = {
  title: "Travel Assistant",
  description: "Travel booking and reservation assistance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
