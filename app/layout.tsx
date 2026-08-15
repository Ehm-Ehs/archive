import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://beforeweforget.netlify.app"),
  title: "Before We Forget... — Nigerian Oral Heritage Archive",
  description:
    "A public open-access archive collecting traditional Nigerian assembly march-in songs, nursery rhymes, moonlight riddles, and ancient proverbs in text and voice recordings.",
  keywords: [
    "Nigerian rhymes",
    "Nursery rhymes",
    "Yoruba songs",
    "Igbo chants",
    "Hausa lullabies",
    "Pidgin nursery rhymes",
    "African oral heritage",
    "Nigerian proverbs",
    "Nigerian riddles",
  ],
  icons: {
    icon: [
      { url: "/before_we_forget_icon_only.svg", type: "image/svg+xml" },
    ],
    apple: "/before_we_forget_icon_only.svg",
  },
  openGraph: {
    title: "Before We Forget... — Nigerian Oral Heritage Archive",
    description:
      "Preserving traditional assembly march-in songs, nursery rhymes, moonlight riddles, and ancient proverbs across Nigerian languages for future generations.",
    url: "https://beforeweforget.netlify.app",
    siteName: "Nigerian Oral Heritage Archive",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Before We Forget - Nigerian Oral Heritage Archive Landing Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Before We Forget... — Nigerian Oral Heritage Archive",
    description:
      "Preserving traditional assembly march-in songs, nursery rhymes, moonlight riddles, and ancient proverbs across Nigerian languages for future generations.",
    images: ["/og-preview.png"],
  },
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
