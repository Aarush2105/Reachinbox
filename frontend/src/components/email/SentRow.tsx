import type { EmailJob } from "../../types/email";
import { toDisplayName } from "../../utils/emailUtils";
import StarButton from "../ui/Star";

interface SentRowProps {
  email: EmailJob;
  onClick: () => void;
}

export default function SentRow({ email, onClick }: SentRowProps) {
  const isFailed = email.status === "FAILED";

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

      <span style={{
          display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 6, fontSize: 11,
          fontWeight: 600, flexShrink: 0, background: isFailed ? "#FFEDED" : "#E8F5ED", color: !isFailed ? "#CC2B2B" : "#2E7D4F",
        }} >
        {isFailed ? "Sent" : "Failed"}
      </span>

      <span style={{ fontSize: 13, color: "#222", fontWeight: 500, flexShrink: 0 }}>
        {email.subject}
      </span>

      <span style={{ fontSize: 13, color: "#888", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {" – "}
        {email.body}
      </span>

      <StarButton />
    </div>
  );
}