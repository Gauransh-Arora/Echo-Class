'use client';
import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const navItems = [
    isLoggedIn && role === "student"
      ? { name: "Student Dashboard", link: "/student-dashboard" }
      : isLoggedIn && role === "teacher"
      ? { name: "Teacher Dashboard", link: "/teacher-dashboard" }
      : null,
    { name: "About Us", link: "/about" },
    { name: "Contact", link: "/contact" },
  ].filter(Boolean);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {!isLoggedIn && (
              <NavbarButton href='/login' variant="primary">Login</NavbarButton>
            )}
            {isLoggedIn && (
              <NavbarButton
                variant="gradient"
                onClick={() => {
                  localStorage.removeItem("access");
                  localStorage.removeItem("role");
                  window.location.href = "/login";
                }}
              >
                Logout
              </NavbarButton>
            )}
            <NavbarButton variant="gradient">Book a call</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {!isLoggedIn && (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                  href="/login"
                >
                  Login
                </NavbarButton>
              )}
              {isLoggedIn && (
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    localStorage.removeItem("access");
                    localStorage.removeItem("role");
                    window.location.href = "/login";
                  }}
                  variant="gradient"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              )}
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="gradient"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default Nav;
