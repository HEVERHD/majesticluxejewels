import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SectionObserver from "@/components/shared/SectionObserver";
import PWAInstallModal from "@/components/shared/PWAInstallModal";
import SocialFloat from "@/components/shared/SocialFloat";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <SectionObserver />
      <PWAInstallModal />
      <SocialFloat />
    </>
  );
}
