import React from "react";
import Navbar from "./_components/navbar";
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex items-center justify-center flex-col m-auto h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
