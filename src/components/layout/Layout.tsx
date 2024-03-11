import React from "react";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <NavBar />
      <main className="relative min-h-[80vh]">{children}</main>

      <Toaster />
    </div>
  );
};

export default Layout;
