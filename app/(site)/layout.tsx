import { LanguageProvider } from "../i18n/LanguageContext";
import Nav from "../components/Nav";
import Footer from "../components/sections/Footer";
import ComingSoon from "../components/ComingSoon";
import { LAUNCH_AT, isLaunched } from "../lib/launch";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if (!isLaunched()) {
  //   return <ComingSoon launchAt={LAUNCH_AT} />;
  // }

  return (
    <LanguageProvider>
      <div className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
