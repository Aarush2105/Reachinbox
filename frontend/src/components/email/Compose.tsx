import { useState, useRef } from "react";
import { emailService } from "../../services/emailService";
import { parseCsvEmails } from "../../utils/emailUtils";

interface ComposeProps {
  onBack: () => void;
  onScheduled: () => void;
  senderEmail?: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "none",
  padding: "10px 0",
  fontSize: 14,
  color: "#222",
  outline: "none",
  background: "transparent",
  fontFamily: "inherit",
  flex: 1,
};

const smallInputStyle: React.CSSProperties = {
  border: "1px solid #E0E0E0",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 13,
  color: "#222",
  width: 60,
  outline: "none",
  fontFamily: "inherit",
  background: "#FAFAFA",
};

export default function Compose({ onBack,onScheduled,senderEmail = "hello@domain.io",}: ComposeProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [delay, setDelay] = useState("");
  const [hourlyLimit, setHourlyLimit] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setTo(parseCsvEmails(text).join(", "));
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!to || !subject || !body || !scheduledTime) {
      setError("Please fill in To, Subject, Body and Schedule Time.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const recipients = to.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
      const baseTime = new Date(scheduledTime).getTime();
      const delayMs = Number(delay || 0) * 1000;

      await Promise.all(
        recipients.map((recipientEmail, i) =>
          emailService.schedule({
            recipientEmail,
            subject,
            body,
            scheduledTime: new Date(baseTime + i * delayMs).toISOString(),
            hourlyLimit: Number(hourlyLimit) || 200,
          })
        )
      );

      onScheduled();
    } catch {
      setError("Failed to schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toolbarButtons = ["↩", "↪", "T·", "B", "I", "U", "≡", "⇕", "≔", "≡·", "⇥≡", "⇤≡", "❝", "⊨", "S̶"];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          borderBottom: "1px solid #F0F0F0",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555", lineHeight: 1 }}>
            ←
          </button>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>Compose New Email</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <label htmlFor="schedule-time"
            style={{ fontSize: 12, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>⏱</span>
            <input id="schedule-time" type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
              style={{ fontSize: 12, border: "none", outline: "none", color: "#555", background: "transparent", fontFamily: "inherit" }}
            />
          </label>

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: loading ? "#A8D5B5" : "#2E7D4F", color: "#fff", border: "1.5px solid #2E7D4F", borderRadius: 20,
              padding: "7px 20px", fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",transition: "background 0.15s",
            }}>
            {loading ? "Scheduling..." : "Send Later"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px 24px" }}>
        {error && (
          <div
            style={{
              background: "#FFEDED",
              color: "#CC2B2B",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {/* From */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #F0F0F0", padding: "10px 0" }}>
          <span style={{ fontSize: 13, color: "#888", width: 80, flexShrink: 0 }}>From</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              border: "1px solid #E8E8E8",
              borderRadius: 8,
              fontSize: 13,
              color: "#222",
            }}
          >
            {senderEmail} <span style={{ color: "#AAA" }}>▾</span>
          </div>
        </div>

        {/* To */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #F0F0F0",
            padding: "10px 0",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: "#888", width: 80, flexShrink: 0 }}>To</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="recipient@example.com"
            style={inputStyle}
          />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "1px solid #E0E0E0",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              color: "#444",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            ↑ Upload List
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleCsvUpload} />
        </div>

        {csvFileName && (
          <div style={{ fontSize: 12, color: "#2E7D4F", padding: "4px 0 4px 80px" }}>
            ✓ {csvFileName} loaded
          </div>
        )}

        {/* Subject */}
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #F0F0F0", padding: "10px 0" }}>
          <span style={{ fontSize: 13, color: "#888", width: 80, flexShrink: 0 }}>Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            style={inputStyle}
          />
        </div>

        {/* Delay + Hourly limit */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "12px 0",
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#888" }}>Delay between 2 emails</span>
            <input
              type="number"
              min={0}
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              placeholder="00"
              style={smallInputStyle}
            />
            <span style={{ fontSize: 12, color: "#AAA" }}>sec</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#888" }}>Hourly Limit</span>
            <input
              type="number"
              min={1}
              value={hourlyLimit}
              onChange={(e) => setHourlyLimit(e.target.value)}
              placeholder="00"
              style={smallInputStyle}
            />
          </div>
        </div>

        {/* Body */}
        <div style={{ marginTop: 12 }}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type Your Reply..."
            style={{
              width: "100%",
              minHeight: 220,
              border: "1px solid #ECECEC",
              borderRadius: 10,
              padding: 14,
              fontSize: 14,
              color: "#222",
              resize: "vertical",
              outline: "none",
              lineHeight: 1.7,
              fontFamily: "inherit",
              background: "#FAFAFA",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "8px 0",
              borderTop: "1px solid #F0F0F0",
              flexWrap: "wrap",
            }}
          >
            {toolbarButtons.map((t, i) => (
              <button
                key={i}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#666",
                  padding: "4px 6px",
                  borderRadius: 4,
                  fontFamily: "inherit",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}