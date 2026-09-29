import { Outlet } from "react-router-dom";
import { Navigation } from "../components/landing/Navigation";
import { FooterSection } from "../components/landing/FooterSection";

export function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}
