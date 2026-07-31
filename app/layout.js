import "@/styles/globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Aurelia House — A Harbor-Side Retreat",
  description:
    "Nineteen rooms on the water in Port Aurelia. Reserve your stay directly, no middleman.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
