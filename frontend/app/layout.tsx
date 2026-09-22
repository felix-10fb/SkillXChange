import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Skill X Change — Learn. Share. Exchange.",
  description: "Connect with people, exchange skills, and grow together with Skill X Change.",
  openGraph: {
    title: "Skill X Change — Learn. Share. Exchange.",
    description: "Discover people who have skills you want to learn and exchange your own skills in return.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#E36648] selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
