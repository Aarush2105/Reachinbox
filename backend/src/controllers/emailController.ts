import { Request, Response } from "express";
import { scheduleEmail } from "../services/mailService";
import prisma from "../config/prisma";

export const scheduleEmailController = async (req: Request,res: Response) => {
  try {
    const {recipientEmail,subject,body,scheduledTime } = req.body;
    const email = await scheduleEmail({recipientEmail,subject,body,
      scheduledTime: new Date(scheduledTime),
    });

    res.status(201).json(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to schedule email",
    });
  }
};

export const getScheduledEmails = async (_req: Request, res: Response) => {
   try {
     const emails = await prisma.emailJob.findMany({
       where: { status: "SCHEDULED" },
       orderBy: { scheduledTime: "asc" },
     });
     res.json(emails);

  } catch (error) {
     res.status(500).json({ message: "Failed to fetch scheduled emails" });
   }
};

export const getSentEmails = async (_req: Request,res: Response
) => {
  const emails = await prisma.emailJob.findMany({
    where: {
      status: {in: ["SENT", "FAILED"],},
    },
    orderBy: {sentTime: "desc",},
  });
  res.json(emails);
};

export const getEmailById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const email = await prisma.emailJob.findUnique({
      where: { id }});

    if (!email) {
      res.status(404).json({ message: "Email job not found" });
      return;
    }
    res.json(email);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch email" });
  }
};