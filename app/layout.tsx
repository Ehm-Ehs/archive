import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nigerian Rhymes Archive 🎶 — Preserving Oral Heritage",
  description:
    "A public open-access archive collecting traditional Nigerian assembly march-in songs, nursery rhymes, and playground chants in text and voice recordings.",
  keywords: ["Nigerian rhymes", "Nursery rhymes", "Yoruba songs", "Igbo chants", "Hausa lullabies", "Pidgin nursery rhymes", "African oral heritage"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            padding: "32px 24px 60px",
          }}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
