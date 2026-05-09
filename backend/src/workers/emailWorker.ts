import { Worker, Job } from "bullmq";
import redisConnection from "../config/redis";
import prisma from "../config/prisma";
import { getTransporter } from "../services/mailService";
import nodemailer from "nodemailer";
import { checkRateLimit } from "../services/rateLimiterService";
import { emailQueue } from "../queues/emailQueue";

console.log("Email worker started");

const worker = new Worker(
  "emailQueue",
  async (job: Job) => {
    const { emailJobId } = job.data;

    const emailJob = await prisma.emailJob.findUnique({
      where: { id: emailJobId },
    });

    if (!emailJob) return;
    if (emailJob.status === "SENT") {
      console.log("Already sent");
      return;
    }

    const { allowed } = await checkRateLimit(emailJob.senderEmail);
    if (!allowed) {
      console.log("Rate limit exceeded → rescheduling");
      await emailQueue.add(
        "send-email",
        { emailJobId },
        {
          delay: 60 * 60 * 1000,
          jobId: `${emailJob.id}-retry-${Date.now()}`,
        }
      );
      return;
    }

    const minDelay = Number(process.env.MIN_DELAY_BETWEEN_EMAILS ?? 2000);
    await new Promise(resolve => setTimeout(resolve, minDelay));

    try {
      const transporter = getTransporter();
      const info = await transporter.sendMail({
        from: `"ReachInbox" <demo@reachinbox.ai>`,
        to: emailJob.recipientEmail,
        subject: emailJob.subject,
        text: emailJob.body,
      });

      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
      await prisma.emailJob.update({
        where: { id: emailJob.id },
        data: {
          status: "SENT",
          sentTime: new Date(),
        },
      });

      console.log(`Email sent to ${emailJob.recipientEmail}`);
    } catch (error) {
      console.error(error);

      await prisma.emailJob.update({
        where: { id: emailJob.id },
        data: { status: "FAILED" },
      });
    }
  },
  {
    connection: redisConnection,
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed`, err);
});