import { useState, useEffect } from "react";
import type { EmailJob } from "../types/email";
import { emailService } from "../services/emailService";

const MOCK_SCHEDULED: EmailJob[] = [
  { id: "1", recipientEmail: "john@example.com", subject: "Meeting follow-up", body: "Hi John, just wanted to follow up ", scheduledTime: "2024-11-05T09:15:00", status: "SCHEDULED", senderEmail: "oliver.brown@domain.io" },
  { id: "2", recipientEmail: "olive@example.com", subject: "Ramit, great to meet you - you'll love it", body: "Hi Olive, just wanted to follow up", scheduledTime: "2024-11-07T18:15:00", status: "SCHEDULED", senderEmail: "oliver.brown@domain.io" },
];

const MOCK_SENT: EmailJob[] = [
  { id: "3", recipientEmail: "sarah@example.com", subject: "Re: Project Update", body: "Thanks for the update", sentTime: "2024-11-03T10:23:00", status: "SENT", senderEmail: "oliver.brown@domain.io" },
  { id: "4", recipientEmail: "support@example.com", subject: "Issue with login", body: "I am having trouble logging in to the dashboard", sentTime: "2024-11-02T14:10:00", status: "SENT", senderEmail: "oliver.brown@domain.io" },
];

export function useEmails() {
  const [scheduled, setScheduled] = useState<EmailJob[]>(MOCK_SCHEDULED);
  const [sent, setSent] = useState<EmailJob[]>(MOCK_SENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduledData, sentData] = await Promise.all([
        emailService.getScheduled(),
        emailService.getSent(),
      ]);
      setScheduled(scheduledData);
      setSent(sentData);
    } catch {
      setError("Could not load emails. Showing cached data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmails(); }, []);
  return { scheduled, sent, loading, error, refetch: fetchEmails };
}