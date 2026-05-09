import type { EmailJob } from "../../types/email";
import { toDisplayName } from "../../utils/emailUtils";
import Avatar from "../ui/Avatar";

interface EmailDetailProps {
  email: EmailJob;
  onBack: () => void;
}

export default function EmailDetail({ email, onBack }: EmailDetailProps) {
  const sentLabel = email.sentTime
    ? new Date(email.sentTime).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Scheduled";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center",justifyContent: "space-between",
          padding: "18px 28px",borderBottom: "1px solid #F0F0F0",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555", padding: "0 4px", lineHeight: 1}}
          >
            ←
          </button>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>
            {email.subject}
          </span>
          <span style={{ fontSize: 13, color: "#888", marginLeft: 4 }}>
            | {email.id.toUpperCase().padStart(8, "0")}
          </span>
        </div>

        <div style={{ display: "flex", gap: 14, color: "#999" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>☆</button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>🗂</button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>🗑</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
          <Avatar name={email.senderEmail} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex",justifyContent: "space-between",alignItems: "center",}}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>
                  {toDisplayName(email.senderEmail)}
                </span>
                <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
                  &lt;{email.senderEmail}&gt;
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#888" }}>{sentLabel}</span>
            </div>
            <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>to me ↓</div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: "#222", lineHeight: 1.8, paddingLeft: 50 }}>
          <p>Hey,</p>
          <br />
          <p>{email.body}</p>
        </div>
      </div>
    </div>
  );
}