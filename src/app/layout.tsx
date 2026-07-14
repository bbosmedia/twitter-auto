import { Providers } from "@/providers";
import "./globals.css";

export const metadata = {
  title: "X Multi-Account Dashboard",
  description: "Manage multiple X (Twitter) accounts from one dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
