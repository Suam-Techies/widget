import "./globals.css";

export const metadata = {
  title: "FixOnce QA • Tawk.to-Style Chatbot & Bug Verification Widget",
  description: "Automated QA Q&A, Bug Verification & Regression Protection with an embeddable Tawk.to-style Chat Widget.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
