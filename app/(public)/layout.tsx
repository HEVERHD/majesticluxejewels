import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SectionObserver from "@/components/shared/SectionObserver";
import PWAInstallModal from "@/components/shared/PWAInstallModal";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <SectionObserver />
      <PWAInstallModal />
    </>
  );
}
