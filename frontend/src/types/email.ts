export interface EmailJob {
  id: string;
  recipientEmail: string;
  subject: string;
  body: string;
  scheduledTime?: string;
  sentTime?: string;
  status: "SCHEDULED" | "SENT" | "FAILED";
  senderEmail: string;
}

export type DashboardView = "scheduled" | "sent" | "compose" | "detail";

export interface User {
  name: string;
  email: string;
  avatar?: string; 
}