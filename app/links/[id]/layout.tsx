import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Singnify Links",
  description: "Smart music fan links powered by Singnify",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
