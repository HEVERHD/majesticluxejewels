import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SectionObserver from "@/components/shared/SectionObserver";
import PWAInstallModal from "@/components/shared/PWAInstallModal";
import SocialFloat from "@/components/shared/SocialFloat";
import AnnouncementBar from "@/components/shared/AnnouncementBar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20 animate-page-entry">{children}</main>
      <Footer />
      <SectionObserver />
      <PWAInstallModal />
      <SocialFloat />
    </>
  );
}
