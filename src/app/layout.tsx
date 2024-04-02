import { Toaster } from "~/components/ui/sonner";
import { Providers } from "~/components/utility/providers";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "../styles/globals.css";
import Sidebar from "./_components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

// export const viewport: Viewport = {
//   themeColor: "#000000",
// };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers attribute="class" defaultTheme="dark">
          <Toaster richColors position="top-center" duration={3000} />
          <Sidebar>{children}</Sidebar>
        </Providers>
      </body>
    </html>
  );
}
