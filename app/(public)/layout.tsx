import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SectionObserver from "@/components/shared/SectionObserver";
import PWAInstallModal from "@/components/shared/PWAInstallModal";
import SocialFloat from "@/components/shared/SocialFloat";
import AnnouncementBar from "@/components/shared/AnnouncementBar";
import SoldToast from "@/components/shared/SoldToast";
import BottomNav from "@/components/shared/BottomNav";
import CartBottomSheet from "@/components/shared/CartBottomSheet";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20 pb-16 md:pb-0 animate-page-entry">{children}</main>
      <Footer />
      <SectionObserver />
      <PWAInstallModal />
      <SocialFloat />
      <SoldToast />
      <CartBottomSheet />
      <BottomNav />
    </>
  );
}
