import { LayoutWrapper } from "@/components/layout-wrapper";
import AuthProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { name: true, bio: true, role: true, image: true },
  });

  const name = user?.name || "Portfolio";
  const role = user?.role || "Full Stack Developer";
  const description =
    user?.bio ||
    "Professional portfolio showcasing full-stack development projects, technical skills, and software engineering expertise.";
  const image = user?.image;

  return {
    title: {
      default: `Portfolio | ${name}`,
      template: `%s | Portfolio | ${name}`,
    },
    description,
    authors: [{ name }],
    creator: name,
    publisher: name,
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${name} - ${role}`,
      description,
      siteName: `${name} Portfolio`,
      images: image ? [{ url: image, width: 1200, height: 630, alt: `${name} - ${role}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - ${role}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme || theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <SmoothScroll>
              <LayoutWrapper>
              {children}
              </LayoutWrapper>
              <Toaster />
            </SmoothScroll>
          </ThemeProvider>
        </AuthProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
