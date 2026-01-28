import Header from "@/components/layout/Header";
import React from "react";
import { getCurrentUser } from "../lib/auth";

const DashboardLayout = async({ children }: { children: React.ReactNode }) => {

  const user = await getCurrentUser()
  return (
    <>
      <Header user={user || null}/>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
};

export default DashboardLayout;
