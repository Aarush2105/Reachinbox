import { useState } from "react";
import type { DashboardView, User } from "../types/email";
import Avatar from "./ui/Avatar";

interface SidebarProps {
  user: User;
  view: DashboardView;
  setView: (v: DashboardView) => void;
  scheduledCount: number;
  sentCount: number;
}

export default function Sidebar({ user, view, setView, scheduledCount, sentCount }: SidebarProps) {
  const [userOpen, setUserOpen] = useState(false);

  const navItem = (
    active: boolean,
    icon: string,
    label: string,
    count: number,
    onClick: () => void
  ) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 10px",
        borderRadius: 8,
        cursor: "pointer",
        background: active ? "#EBF5EE" : "transparent",
        color: active ? "#2E7D4F" : "#555",
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        transition: "background 0.12s",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{icon}</span> {label}
      </span>
      <span
        style={{
          fontSize: 12,
          background: active ? "#2E7D4F" : "#E8E8E8",
          color: active ? "#fff" : "#888",
          borderRadius: 99,
          padding: "1px 7px",
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </div>
  );

  return (
    <aside
      style={{
        width: 180,
        borderRight: "1px solid #F0F0F0",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        gap: 8,
        flexShrink: 0,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: -1, color: "#111", padding: "0 4px", marginBottom: 12 }}
      >
        ON<span style={{ color: "#2E7D4F" }}>B</span>
      </div>
      <div onClick={() => setUserOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10,
          cursor: "pointer",
          background: "#F9F9F9",
          marginBottom: 4,
        }}
      >
        <Avatar name={user.email} size={28} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#111",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#888",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.email}
          </div>
        </div>
        <span style={{ fontSize: 10, color: "#AAA" }}>{userOpen ? "▲" : "▼"}</span>
      </div>

      {/* Compose */}
      <button
        onClick={() => setView("compose")}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#246040")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#2E7D4F")}
        style={{
          background: "#2E7D4F",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "9px 0",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
          marginBottom: 12,
          fontFamily: "inherit",
          transition: "background 0.15s",
        }}
      >
        Compose
      </button>

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#BBB",
          letterSpacing: 1,
          padding: "0 4px",
          marginBottom: 4,
        }}
      >
        CORE
      </div>

      {navItem(view === "scheduled", "⏱", "Scheduled", scheduledCount, () => setView("scheduled"))}
      {navItem(view === "sent", "✉", "Sent", sentCount, () => setView("sent"))}
    </aside>
  );
}