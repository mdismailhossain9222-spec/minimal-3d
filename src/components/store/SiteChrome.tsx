import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import SearchDialog from "@/components/store/SearchDialog";

export default function SiteChrome() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
      <SearchDialog />
    </div>
  );
}
