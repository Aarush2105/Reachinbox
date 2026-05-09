import prisma from "../config/prisma";
import { emailQueue } from "../queues/emailQueue";
import nodemailer from "nodemailer";

console.log("ETHEREAL_USER:", process.env.ETHEREAL_USER);
console.log("ETHEREAL_PASS:", process.env.ETHEREAL_PASS);

interface ScheduleEmailInput {
  recipientEmail: string;
  subject: string;
  body: string;
  scheduledTime: Date;
}

export const scheduleEmail = async ({recipientEmail,subject,body,scheduledTime}: ScheduleEmailInput) => {
  const emailJob = await prisma.emailJob.create({
    data: {
      recipientEmail,
      senderEmail: "abc@mail.com",
      subject,
      body,
      scheduledTime,
      status: "SCHEDULED",
    },
  });

  const delay = scheduledTime.getTime() - Date.now();
  console.log("Delay:", delay);

  const bullJob= await emailQueue.add("send-email",
    {emailJobId: emailJob.id },
    {
      delay,
      jobId: emailJob.id,
      removeOnComplete: false,
      removeOnFail: false
    }
  );

  await prisma.emailJob.update({
    where: { id: emailJob.id },
    data: {
      bullJobId: bullJob.id?.toString(),
    }
  });

  return emailJob;
};

export const getTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });
};