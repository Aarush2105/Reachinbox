import type { EmailJob } from "../../types/email";
import { formatDateTime, toDisplayName } from "../../utils/emailUtils";
import StarButton from "../ui/Star";

interface ScheduledRowProps {
  email: EmailJob;
  onClick: () => void;
}

export default function ScheduledRow({ email, onClick }: ScheduledRowProps) {
  return (
    <div onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #F0F0F0",
        cursor: "pointer", transition: "background 0.12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ fontSize: 13, color: "#444", minWidth: 120, fontWeight: 500 }}>
        To: {toDisplayName(email.recipientEmail)}
      </span>

      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 6,
          background: "#FFF3E0", color: "#E07B00", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
        }}>
        <span>⏱</span> {formatDateTime(email.scheduledTime!)}
      </span>

      <span style={{ fontSize: 13, color: "#222", fontWeight: 500, flexShrink: 0 }}>
        {email.subject}
      </span>

      <span style={{ fontSize: 13, color: "#888", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
        {" – "}
        {email.body}
      </span>
      <StarButton />
    </div>
  );
}