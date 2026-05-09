import redis from "../config/redis";

export const checkRateLimit = async (senderEmail: string) => {
  const hourKey = new Date().toISOString().slice(0, 13);

  const globalKey = `rate:global:${hourKey}`;
  const senderKey = `rate:sender:${senderEmail}:${hourKey}`;

  const globalCount = await redis.incr(globalKey);
  const senderCount = await redis.incr(senderKey);

  await redis.expire(globalKey, 3600);
  await redis.expire(senderKey, 3600);

  const globalLimit = Number(process.env.MAX_EMAILS_PER_HOUR || 200);
  const senderLimit = Number(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || 100);

  const allowed =globalCount <= globalLimit && senderCount <= senderLimit;

  return { allowed,globalCount,senderCount};
};