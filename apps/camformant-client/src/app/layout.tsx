import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { NavigationBar } from "@/components/navigation-bar/navigation-bar";
import { AuthProvider } from "@/context/auth";
import { cookies } from "next/headers";
import { SocketContextProvider } from "@/context/SocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Camformant Client App",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: [
    { rel: "apple-touch-icon", url: "icons/camformant-128.png" },
    { rel: "icon", url: "icons/camformant-128.png" },
  ],
};

// New viewport export
export const viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  shrinkToFit: "no",
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("id_token");
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider isLogin={!!userCookie}>
          {/* <NavigationBar /> */}
          <SocketContextProvider>{children}</SocketContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
