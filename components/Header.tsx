"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Loader2, ChevronDown, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const setInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    setInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMobileMenu = () => {
    const next = !mobileMenuOpen;
    setMobileMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  const handleMouseEnter = (name: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const handleAvatarClick = async () => {
    if (!user || redirecting) return;
    setRedirecting(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      router.push(!error && profile?.role === "superadmin" ? "/superadmin" : "/dashboard");
    } catch {
      router.push("/dashboard");
    } finally {
      setRedirecting(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Weight Loss", href: "/weightloss" },
    { name: "Pricing", href: "/pricing" },
    
    {
      name: "Treatment Areas",
      href: "#",
      hasDropdown: true,
      subItems: [
        { name: "Spine & Nerve Disorders", href: "/spine-nerve-disorder-treatment", icon: "🦴" },
        { name: "Joint & Sports Injury", href: "/joint-sports-injury-treatment", icon: "🏃" },
        { name: "Chronic Pain", href: "/chronic-pain-treatment", icon: "💊" },
        { name: "Precision Regenerative Care", href: "/precision-regenerative-care", icon: "🔬" },
        { name: "Musculoskeletal Pain", href: "/musculoskeletal-pain-treatment", icon: "💪" },
        { name: "Hair Treatment", href: "/hair-treatment", icon: "✨" },
      ],
    },
    {
      name: "Our Services",
      href: "#services",
      hasDropdown: true,
      subItems: [
        { name: "PBSE Therapy", href: "/services/pbse-therapy", icon: "🧬" },
        { name: "Bone Marrow Therapy", href: "/services/bone-marrow-therapy", icon: "🦴" },
        { name: "PBSE Volume Reduction", href: "/services/pbse-volume-reduction-treatment", icon: "🔬" },
        { name: "Natural Killer Cell Therapy", href: "/services/natural-killer-cell-therapy", icon: "🛡️" },
        { name: "Muse Cell Therapy", href: "/services/muse-cell-therapy", icon: "⚗️" },
        { name: "GcMAF Immune Therapy", href: "/services/gcmaf-immune-therapy", icon: "🧪" },
        { name: "PRP Therapy", href: "/services/prp-therapy", icon: "💉" },
        { name: "CD34+ Stem Cell Enrichment", href: "/services/cd34-stem-cell-enrichment", icon: "🧬" },
        { name: "CD45RA Stem Cell Therapy", href: "/services/cd45ra-stem-cell-therapy", icon: "🔭" },
        { name: "CD138 Plasma Cell Therapy", href: "/services/cd138-plasma-cell-therapy", icon: "🌡️" },
        { name: "CD56+ Cell Enrichment", href: "/services/cd56-cell-enrichment", icon: "🔬" },
        { name: "TCR Therapy", href: "/services/tcr-therapy", icon: "🧬" },
        { name: "CD19+ Cell Therapy", href: "/services/cd19-cell-therapy", icon: "💊" },
        { name: "Advanced Gene Therapy", href: "/services/advanced-gene-therapy", icon: "🧬" },
      ],
    },
    {
      name: "More",
      href: "#",
      hasDropdown: true,
      subItems: [
        { name: "About Us", href: "/about-us", icon: "🏥" },
        { name: "Success Stories", href: "/success-stories", icon: "⭐" },
        { name: "Contact Us", href: "/contact-us", icon: "📞" },
        { name: "Privacy Policy", href: "/privacy-policy", icon: "🔒" },
        { name: "Terms & Conditions", href: "/terms-conditions", icon: "📋" },
        { name: "FAQ", href: "/faq", icon: "❓" },
      ],
    },
    {name:"Blogs", href:"/blogs"},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .header-root {
          font-family: 'Inter', 'Poppins', sans-serif;
        }

        /* Glass morphism header */
        .header-glass {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(16, 185, 129, 0.12);
          box-shadow: 0 1px 0 rgba(16, 185, 129, 0.08), 0 4px 24px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .header-glass.scrolled {
          box-shadow: 0 2px 32px rgba(0, 0, 0, 0.10), 0 1px 0 rgba(16, 185, 129, 0.15);
          border-bottom-color: rgba(16, 185, 129, 0.20);
        }

        /* Gradient accent top bar */
        .header-accent-bar {
          height: 3px;
          background: linear-gradient(90deg, #10b981 0%, #059669 35%, #0d9488 65%, #6366f1 100%);
          background-size: 200% 100%;
          animation: shimmer 4s ease infinite;
        }

        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }

        /* Nav link styles */
        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14.5px;
          font-weight: 500;
          color: #374151;
          padding: 6px 4px;
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 2px;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover,
        .nav-link.active {
          color: #059669;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link .chevron {
          transition: transform 0.25s ease;
          color: #9ca3af;
        }

        .nav-link:hover .chevron,
        .nav-link.dropdown-open .chevron {
          transform: rotate(180deg);
          color: #059669;
        }

        /* Dropdown */
        .dropdown-card {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(-6px);
          min-width: 230px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.12);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(16, 185, 129, 0.08);
          padding: 8px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 200;
          overflow: hidden;
        }

        .dropdown-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #6366f1);
          border-radius: 16px 16px 0 0;
        }

        .dropdown-card.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-card.wide {
          min-width: 260px;
        }

        .dropdown-card.grid-2 {
          min-width: 460px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 12px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
          cursor: pointer;
        }

        .dropdown-item:hover,
        .dropdown-item.active {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(99, 102, 241, 0.05));
          color: #059669;
          transform: translateX(2px);
        }

        .dropdown-item .di-icon {
          font-size: 15px;
          line-height: 1;
          flex-shrink: 0;
        }

        /* CTA Button */
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          border-radius: 100px;
          padding: 9px 20px;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
          white-space: nowrap;
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
        }

        .cta-btn:active {
          transform: translateY(0);
        }

        /* Avatar */
        .avatar-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px;
          border-radius: 100px;
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #10b981, #6366f1) border-box;
          cursor: pointer;
          transition: box-shadow 0.2s ease;
        }

        .avatar-btn:hover {
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
        }

        .avatar-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
        }

        /* Avatar dropdown */
        .avatar-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 220px;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 200;
        }

        .avatar-group:hover .avatar-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        /* Hamburger */
        .hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          background: rgba(16, 185, 129, 0.05);
          color: #374151;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .hamburger:hover {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.35);
          color: #059669;
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: #ffffff;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        .mobile-drawer-header {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 16px;
          background: #fff;
          border-bottom: 1px solid #f0fdf4;
          z-index: 1;
        }

        .mobile-drawer-body {
          flex: 1;
          padding: 8px 16px 24px;
        }

        .mobile-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 12px;
          border-radius: 12px;
          font-size: 15.5px;
          font-weight: 500;
          color: #1f2937;
          cursor: pointer;
          border: none;
          background: transparent;
          text-align: left;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          background: rgba(16, 185, 129, 0.07);
          color: #059669;
        }

        .mobile-nav-item .m-chevron {
          transition: transform 0.25s ease;
          color: #9ca3af;
          flex-shrink: 0;
        }

        .mobile-nav-item.expanded .m-chevron {
          transform: rotate(180deg);
          color: #059669;
        }

        .mobile-submenu {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }

        .mobile-submenu.open {
          grid-template-rows: 1fr;
        }

        .mobile-submenu-inner {
          overflow: hidden;
          padding: 0 4px;
        }

        .mobile-sub-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          margin: 2px 0;
          border-radius: 10px;
          font-size: 14px;
          color: #4b5563;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }

        .mobile-sub-item:hover,
        .mobile-sub-item.active {
          background: rgba(16, 185, 129, 0.08);
          color: #059669;
        }

        .mobile-footer {
          padding: 16px 20px 32px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Marquee Banner */
        .marquee-container {
          position: relative;
          width: 100%;
          background: linear-gradient(90deg, #047857 0%, #10b981 40%, #059669 70%, #047857 100%);
          background-size: 200% 100%;
          animation: shimmerBg 4s ease infinite;
          color: white;
          z-index: 101;
        }

        @keyframes shimmerBg {
          0% { background-position: 0% 0; }
          50% { background-position: 100% 0; }
          100% { background-position: 0% 0; }
        }

        .marquee-bar {
          overflow: hidden;
          padding: 10px 0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.4px;
          white-space: nowrap;
          cursor: pointer;
          text-align: center;
        }
        
        .marquee-content {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 30s linear infinite;
        }

        .marquee-bar:hover .marquee-content {
          animation-play-state: paused;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        /* Mega Banner */
        .mega-banner-wrapper {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100vw;
          z-index: 200;
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
        }

        @keyframes sparkleAnim {
          0%, 100% { opacity: 0.5; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(30deg); }
        }
      `}</style>

      {/* Accent bar */}
      <div className="header-accent-bar" />

      <header
        className={`header-root sticky top-0 w-full z-[100] header-glass ${scrolled ? "scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[96px]">

            {/* Logo */}
            <a href="/" className="flex items-center shrink-0" onClick={closeMobileMenu}>
              <img
                src="/logo2.png"
                alt="Genestac Therapeutics"
                className="h-16 md:h-28 w-auto object-contain rounded-2xl"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActiveLink = link.subItems
                  ? link.subItems.some((sub) => pathname === sub.href)
                  : pathname === link.href;
                const isActive = activeDropdown === link.name;
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => link.hasDropdown && handleMouseEnter(link.name)}
                    onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
                  >
                    <a
                      href={link.href}
                      className={`nav-link ${isActiveLink ? "active" : ""} ${isActive ? "dropdown-open" : ""}`}
                      style={{ padding: "6px 10px" }}
                    >
                      {link.name}
                      {link.hasDropdown && (
                        <ChevronDown size={13} className="chevron" strokeWidth={2.5} />
                      )}
                    </a>

                    {/* Dropdown */}
                    {link.subItems && (
                      <div
                        className={`dropdown-card ${isActive ? "open" : ""} ${link.subItems.length > 6 ? "grid-2" : ""}`}
                        onMouseEnter={() => handleMouseEnter(link.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {link.subItems.map((sub, idx) => (
                          <a key={idx} href={sub.href} className={`dropdown-item ${pathname === sub.href ? "active" : ""}`}>
                            <span className="di-icon">{sub.icon}</span>
                            <span>{sub.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="avatar-group relative">
                  {(() => {
                    const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
                    const avatarUrl = user?.user_metadata?.avatar_url
                      ? user.user_metadata.avatar_url
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff&rounded=true&size=128`;
                    return (
                      <button
                        type="button"
                        className="avatar-btn"
                        onClick={handleAvatarClick}
                        disabled={redirecting}
                        title="Go to your dashboard"
                      >
                        {redirecting && <Loader2 className="h-4 w-4 animate-spin text-green-600" />}
                        <img src={avatarUrl} alt={displayName} className="avatar-img" />
                      </button>
                    );
                  })()}
                  {/* Avatar dropdown */}
                  <div className="avatar-dropdown -mt-2">
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                      <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#111827", margin: 0 }}>
                        {user?.user_metadata?.full_name ?? user?.email}
                      </p>
                      <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px", wordBreak: "break-all" }}>
                        {user?.email}
                      </p>
                    </div>
                    <div style={{ padding: "6px" }}>
                      <Link
                        href="/dashboard/settings"
                        prefetch={false}
                        style={{
                          display: "block",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13.5px",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUser(null);
                          window.location.href = "/";
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13.5px",
                          color: "#dc2626",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="cta-btn">
                  Get Started
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center lg:hidden">
              <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Promotional Marquee Banner */}
        <div
          className="marquee-container"
          onMouseEnter={() => {
            if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
            setBannerOpen(true);
          }}
          onMouseLeave={() => {
            bannerTimerRef.current = setTimeout(() => setBannerOpen(false), 180);
          }}
          onClick={() => setBannerOpen(true)}
        >
          <div className="marquee-bar">
            <div className="marquee-content" style={{ display: "inline-flex", alignItems: "center" }}>
              🎉&nbsp; Launch Celebration — <strong>100% OFF</strong> for our first 100 clients! &nbsp;▸&nbsp; Doctor-Guided Programs &nbsp;▸&nbsp; Personalized Treatment &nbsp;▸&nbsp; Real, Sustainable Results &nbsp;▸&nbsp; Only 100 spots available! Hover to learn more &nbsp; 🎉
              <span style={{ marginLeft: "15px", backgroundColor: "white", color: "#059669", padding: "2px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>View</span>
            </div>
          </div>

          {/* Mega Promo Panel */}
          {bannerOpen && (
            <div className="mega-banner-wrapper">

              {/* ── MAIN PANEL ── */}
              <div style={{ background: "#edf1f7", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", maxWidth: 1280, margin: "0 auto", overflow: "hidden", position: "relative", minHeight: 200 }}>

                {/* ── LEFT: Offer Content ── */}
                <div style={{ flex: 1, padding: "20px 48px 20px 52px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 5 }}>

                  {/* Launch label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>🎉</span>
                    <span style={{ color: "#b45309", fontWeight: 800, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "Montserrat, sans-serif" }}>LAUNCH CELEBRATION</span>
                  </div>

                  {/* Heading */}
                  <h2 style={{ fontSize: 44, fontWeight: 900, color: "#001f3f", lineHeight: 0.95, margin: "0 0 8px", fontFamily: "Montserrat, sans-serif", letterSpacing: "-1px" }}>100% OFF</h2>

                  {/* Green banner */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#059669", color: "white", padding: "5px 14px", marginBottom: 10, fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", alignSelf: "flex-start", borderRadius: 3 }}>
                    FOR THE FIRST&nbsp;<span style={{ color: "#fcd34d" }}>100</span>&nbsp;CLIENTS!
                  </div>

                  {/* Description */}
                  <p style={{ color: "#4b5563", fontSize: 12, lineHeight: 1.5, marginBottom: 12, maxWidth: 420 }}>
                    We&apos;re celebrating our launch with an exclusive <strong style={{ color: "#059669" }}>100% OFF</strong> on all services for the first 100 clients only!
                  </p>

                  {/* 3 Features in a row */}
                  <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
                    {[
                      { icon: "fa-user-doctor", label: "Doctor-Guided\nProgram" },
                      { icon: "fa-leaf",        label: "Personalized\nTreatment" },
                      { icon: "fa-heart-pulse", label: "Real,\nSustainable Results" },
                    ].map(f => (
                      <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#d1fae5", border: "2px solid #6ee7b7", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", fontSize: 12, flexShrink: 0 }}>
                          <i className={`fa-solid ${f.icon}`}></i>
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: "#1f2937", whiteSpace: "pre-line", lineHeight: 1.3 }}>{f.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <Link
                      href="/login?redirect=%2Fdashboard%2Fcart%3Fcoupon%3DWELCOME100"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#059669", color: "white", padding: "10px 20px", borderRadius: 7, fontWeight: 800, fontSize: 12, textDecoration: "none", boxShadow: "0 4px 14px rgba(5,150,105,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      CLAIM YOUR FREE OFFER NOW <ArrowRight size={14} />
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className="fa-solid fa-users" style={{ color: "#374151", fontSize: 13 }}></i>
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.4, color: "#374151" }}>
                        <strong>Hurry!</strong> Only <strong style={{ color: "#059669" }}>100</strong> spots available
                      </div>
                    </div>
                  </div>

                  <p style={{ color: "#9ca3af", fontSize: 10, marginTop: 8 }}>Offer valid for the first 100 clients only. Terms &amp; conditions apply.</p>
                </div>

                {/* ── RIGHT: Dark oval section ── */}
                <div style={{ width: 380, minWidth: 380, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>

                  {/* Large dark navy oval — extends left to create convex curve */}
                  <div style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    borderRadius: "50%",
                    background: "#0a2540",
                    top: "50%",
                    left: "-220px",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }} />

                  {/* Gold confetti sparkles */}
                  {[
                    { top: "8%",  left: "22%", size: 14, delay: "0s"   },
                    { top: "18%", left: "55%", size: 10, delay: "0.4s" },
                    { top: "60%", left: "18%", size: 12, delay: "0.8s" },
                    { top: "75%", left: "50%", size: 8,  delay: "0.2s" },
                    { top: "35%", left: "65%", size: 10, delay: "1s"   },
                  ].map((s, i) => (
                    <span key={i} style={{
                      position: "absolute", top: s.top, left: s.left,
                      zIndex: 4, color: "#f6c90e", fontSize: s.size,
                      animation: `sparkleAnim 2.5s ${s.delay} ease-in-out infinite`,
                      pointerEvents: "none",
                    }}>✦</span>
                  ))}

                  {/* ── Badge circle ── */}
                  <div style={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: "#0c2d55",
                    border: "5px solid #d4af37",
                    boxShadow: "0 0 0 3px #8B6914, 0 8px 24px rgba(0,0,0,0.5)",
                    top: "10%",
                    left: "14%",
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "white",
                    gap: 1,
                    padding: 8,
                  }}>
                    <i className="fa-solid fa-gift" style={{ fontSize: 16, color: "#fbbf24", marginBottom: 1 }}></i>
                    <span style={{ fontSize: 17, fontWeight: 900, lineHeight: 1, fontFamily: "Montserrat, sans-serif" }}>100% OFF</span>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>FOR THE FIRST</span>

                    {/* Gold ribbon */}
                    <div style={{
                      position: "absolute",
                      bottom: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #92400e, #fcd34d, #b45309)",
                      color: "#001f3f",
                      fontWeight: 900,
                      fontSize: 9,
                      padding: "3px 12px",
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
                      border: "1px solid #fcd34d",
                    }}>
                      100 CLIENTS!
                    </div>
                  </div>

                  {/* Your Health Our Commitment box */}
                  <div style={{
                    position: "absolute",
                    top: "62%",
                    left: "8%",
                    border: "1.5px solid #10b981",
                    borderRadius: 7,
                    padding: "6px 14px",
                    color: "white",
                    textAlign: "center",
                    fontSize: 10.5,
                    fontWeight: 700,
                    zIndex: 5,
                    background: "rgba(16,185,129,0.08)",
                    lineHeight: 1.4,
                  }}>
                    Your Health<br />Our Commitment
                    <div style={{ marginTop: 4, color: "#34d399", fontSize: 12 }}>
                      <i className="fa-solid fa-heart-pulse"></i>
                    </div>
                  </div>

                  {/* Girl image */}
                  <img
                    src="/images/cropped-girl.png"
                    alt="Transform your health at Genestac Therapeutics"
                    style={{ position: "relative", zIndex: 6, height: 300, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
                  />
                </div>
              </div>
              </div>

              {/* ── BOTTOM TRUST BAR ── */}
              <div style={{ background: "#001f3f", padding: "13px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "center", gap: 48, padding: "0 52px", flexWrap: "wrap" }}>
                  {[
                    { icon: "fa-shield-halved", label: "Safe & Clinically Proven" },
                    { icon: "fa-user-doctor",   label: "Expert Doctors & Support" },
                    { icon: "fa-leaf",           label: "Personalized Nutrition" },
                    { icon: "fa-chart-line",     label: "Visible Results, Sustainable Change" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, color: "#e2e8f0", fontSize: 13.5, fontWeight: 600 }}>
                      <i className={`fa-solid ${item.icon}`} style={{ color: "#34d399", fontSize: 20 }}></i>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <a href="/" onClick={closeMobileMenu}>
            <img src="/logo.jpeg" alt="Genestac" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </a>
          <button className="hamburger" onClick={closeMobileMenu} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="mobile-drawer-body">
          {navLinks.map((link) => {
            const isOpen = openDropdown === link.name;
            return (
              <div key={link.name}>
                <button
                  className={`mobile-nav-item ${(link.subItems ? link.subItems.some((sub) => pathname === sub.href) : pathname === link.href) ? "active" : ""} ${isOpen ? "expanded" : ""}`}
                  onClick={() => {
                    if (link.subItems) {
                      setOpenDropdown(isOpen ? null : link.name);
                    } else {
                      closeMobileMenu();
                      window.location.href = link.href;
                    }
                  }}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown size={16} className="m-chevron" strokeWidth={2} />}
                </button>

                {link.subItems && (
                  <div className={`mobile-submenu ${isOpen ? "open" : ""}`}>
                    <div className="mobile-submenu-inner">
                      {link.subItems.map((sub, idx) => (
                          <a
                            key={idx}
                            href={sub.href}
                            className={`mobile-sub-item ${pathname === sub.href ? "active" : ""}`}
                            onClick={closeMobileMenu}
                          >
                            <span style={{ fontSize: 16 }}>{sub.icon}</span>
                            <span>{sub.name}</span>
                          </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mobile-footer">
          {user ? (
            <>
              <button
                type="button"
                className="cta-btn"
                style={{ justifyContent: "center", padding: "13px 20px", fontSize: 15 }}
                onClick={async () => { closeMobileMenu(); await handleAvatarClick(); }}
                disabled={redirecting}
              >
                {redirecting ? "Redirecting..." : "Dashboard"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  window.location.href = "/";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "13px 20px",
                  borderRadius: "100px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#374151",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="cta-btn"
              onClick={closeMobileMenu}
              style={{ justifyContent: "center", padding: "13px 20px", fontSize: 15 }}
            >
              Get Started <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
