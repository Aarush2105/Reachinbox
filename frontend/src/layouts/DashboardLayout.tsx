import type { ReactNode } from "react";
import type { DashboardView, User } from "../types/email";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  user: User;
  view: DashboardView;
  setView: (v: DashboardView) => void;
  scheduledCount: number;
  sentCount: number;
  children: ReactNode;
}

export default function DashboardLayout({
  user,
  view,
  setView,
  scheduledCount,
  sentCount,
  children,
}: DashboardLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: "#fff",
        color: "#111",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <Sidebar
        user={user}
        view={view}
        setView={setView}
        scheduledCount={scheduledCount}
        sentCount={sentCount}
      />
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}