import { useState } from "react";
import type { DashboardView, EmailJob } from "../types/email";
import { useEmails } from "../hooks/useEmails";
import { useUser } from "../hooks/useUser";
import DashboardLayout from "../layouts/DashboardLayout";
import ScheduledRow from "../components/email/ScheduledRow";
import SentRow from "../components/email/SentRow";
import EmailDetail from "../components/email/Detail";
import Compose from "../components/email/Compose";  

export default function Dashboard() {
  const CURRENT_USER = useUser();
  const [view, setView] = useState<DashboardView>("scheduled");
  const [selectedEmail, setSelectedEmail] = useState<EmailJob | null>(null);
  const [search, setSearch] = useState("");

  const { scheduled, sent, loading, error, refetch } = useEmails();

  const filteredScheduled = scheduled.filter(
    (e) =>
      e.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSent = sent.filter(
    (e) =>
      e.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openEmail = (email: EmailJob) => {
    setSelectedEmail(email);
    setView("detail");
  };

  if (view === "compose") {
    return (
      <DashboardLayout user={CURRENT_USER} view={view} setView={setView} scheduledCount={scheduled.length} sentCount={sent.length}>
        <Compose senderEmail={CURRENT_USER.email} onBack={() => setView("scheduled")} onScheduled={() => {
            refetch();
            setView("scheduled");
          }}/>
      </DashboardLayout>
    );
  }

  if (view === "detail" && selectedEmail) {
    return (
      <DashboardLayout user={CURRENT_USER} view={view} setView={setView} scheduledCount={scheduled.length} sentCount={sent.length} >
        <EmailDetail email={selectedEmail}
          onBack={() => setView(selectedEmail.status === "SCHEDULED" ? "scheduled" : "sent")}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={CURRENT_USER} view={view} setView={setView} scheduledCount={scheduled.length} sentCount={sent.length}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #F0F0F0",flexShrink: 0}}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#F5F5F5",borderRadius: 8,padding: "8px 14px" }}>
          <span style={{ color: "#AAA", fontSize: 15 }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search" style={{ background: "none", border: "none", outline: "none", fontSize: 14,color: "#222",width: "100%",fontFamily: "inherit"}}
          />
        </div>
        <button onClick={refetch} title="Refresh"
          style={{ background: "none", border: "1px solid #E8E8E8", borderRadius: 8, padding: "8px 10px", cursor: "pointer",fontSize: 15,color: "#777"}}
        >
          {loading ? "⏳" : "↻"}
        </button>
        <button
          style={{ background: "none", border: "1px solid #E8E8E8", borderRadius: 8,padding: "8px 10px",cursor: "pointer",fontSize: 15,color: "#777"}}
        >
          ⚙
        </button>
      </div>

      {error && (
        <div style={{ background: "#FFF8E1", color: "#856404", padding: "8px 20px",fontSize: 13,borderBottom: "1px solid #FFE69C"}}>
          ⚠ {error}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#AAA", fontSize: 14 }}>
            Loading...
          </div>
        ) : view === "scheduled" ? (
          filteredScheduled.length === 0 ? (
            <EmptyState icon="📅" label="No scheduled emails" />
          ) : (
            filteredScheduled.map((e) => (
              <ScheduledRow key={e.id} email={e} onClick={() => openEmail(e)} />
            ))
          )
        ) : filteredSent.length === 0 ? (
          <EmptyState icon="📬" label="No sent emails" />
        ) : (
          filteredSent.map((e) => (
            <SentRow key={e.id} email={e} onClick={() => openEmail(e)} />
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "#CCC", fontSize: 14 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      {label}
    </div>
  );
}