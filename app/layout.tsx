import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuCraft - Digital Menu Generator for Restaurants",
  description: "Create beautiful digital menus in minutes. Professional menu builder with QR codes, custom templates, and real-time updates. No coding required.",
};

// Runs before first paint: unless the visitor prefers reduced motion, mark the
// document so the two cinematic reveals (hero, statement) start hidden and the
// landing motion can take ownership without a flash. LandingMotion removes the
// class as soon as the tweens exist — or immediately if motion is off.
const motionGate = `
try {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('motion-ok');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
