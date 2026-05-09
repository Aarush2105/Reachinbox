import type { EmailJob } from "../types/email";
import BASE from "./api";

export const emailService = {
  getScheduled: async (): Promise<EmailJob[]> => {
    const res = await BASE.get("/scheduled");
    return res.data;
  },

  getSent: async (): Promise<EmailJob[]> => {
    const res = await BASE.get("/sent");
    return res.data;
  },

  getById: async (id: string): Promise<EmailJob> => {
    const res = await BASE.get(`/${id}`);
    return res.data;
  },

  schedule: async (payload: {
    recipientEmail: string;
    subject: string;
    body: string;
    scheduledTime: string;
    hourlyLimit?: number;
  }): Promise<EmailJob> => {
    const res = await BASE.post("/schedule", payload);
    return res.data;
  },
};