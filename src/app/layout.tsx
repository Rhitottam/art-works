import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import NavBar from "./components/NavBar";
import Container from "./components/Container";

// export const metadata: Metadata = {
//   title: "Art Works",
//   description: "Generated for Artists",
// };
const mont = Montserrat({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mont.className} min-h-screen flex flex-col`}>
        <Container>
          <NavBar />
          {children}
        </Container>
      </body>

      <script async src="//s.imgur.com/min/embed.js"></script>
    </html>
  );
}
