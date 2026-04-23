import './globals.css';

export const metadata = {
  title: 'Blue Wing — Sovereign Agentic Entity',
  description: 'Blue Wing: An industrial-grade AI operating system with 3D holographic HUD, voice interaction, and autonomous task execution.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
