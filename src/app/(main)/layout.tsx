// app/(main)/layout.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider requireAuth={true}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthProvider>
  );
}