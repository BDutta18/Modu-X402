import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getApiKey } from "../../lib/auth";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Developers", href: "#developers" },
  { name: "Pricing", href: "#pricing" },
  { name: "Playground", href: "/playground" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const authed = !!getApiKey();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 rounded-full ${
          isScrolled || isMobileMenuOpen
            ? "glass-navbar max-w-[1240px]"
            : "bg-white/60 backdrop-blur-xl border border-black/[0.06] shadow-sm max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="modu logo"
              className={`transition-all duration-500 object-contain rounded-md ${
                isScrolled ? "w-7 h-7" : "w-8 h-8"
              }`}
            />
            <span
              className={`font-display font-bold tracking-tight text-black transition-all duration-500 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              modu
            </span>
            <span className="font-mono text-[10px] text-zinc-600 border border-black/10 rounded-full px-2 py-0.5 ml-1 hidden sm:inline-block bg-white/50">
              x402
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-700 hover:text-black transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-zinc-700 hover:text-black transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/docs"
              className={`text-zinc-700 hover:text-black font-medium transition-all duration-500 ${
                isScrolled ? "text-xs" : "text-sm"
              }`}
            >
              Docs
            </Link>
            <button
              onClick={() => navigate(authed ? "/app/endpoints" : "/app/cli-auth")}
              className={`bg-black hover:bg-zinc-800 text-white rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                isScrolled ? "px-5 h-9 text-xs" : "px-6 h-10 text-sm"
              }`}
            >
              {authed ? "Dashboard" : "Get started"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-black"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-0 bg-white/95 backdrop-blur-2xl z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-6">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-display font-semibold text-black hover:text-zinc-600 transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-display font-semibold text-black hover:text-zinc-600 transition-colors"
                >
                  {link.name}
                </Link>
              )
            )}
            <Link
              to="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-display font-semibold text-black hover:text-zinc-600 transition-colors"
            >
              Documentation
            </Link>
          </div>

          <div className="flex gap-4 pt-8 border-t border-black/10">
            <button
              className="flex-1 border border-black/20 text-black rounded-full h-12 text-sm font-medium hover:bg-black/5"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/playground");
              }}
            >
              Playground
            </button>
            <button
              className="flex-1 bg-black text-white rounded-full h-12 text-sm font-medium hover:bg-zinc-800"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate(authed ? "/app/endpoints" : "/app/cli-auth");
              }}
            >
              {authed ? "Dashboard" : "Get started"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
