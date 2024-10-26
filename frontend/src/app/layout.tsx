import { Scene3D } from "./cube";
import Navbar from "./components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism, dark } from "@clerk/themes";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [dark],
      }}
    >
      <html lang="en">
        <body>
          {children}
          <Navbar />
        </body>
      </html>
    </ClerkProvider>
  );
}
