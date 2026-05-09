export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { weekday: "short" }) +" " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  );
}

export function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function toDisplayName(email: string): string {
  return email
    .split("@")[0]
    .replace(".", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function parseCsvEmails(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.includes("@"));
}