import { Router } from "express";
import {scheduleEmailController,getScheduledEmails,getSentEmails} from "../controllers/emailController";
import { getEmailById } from "../controllers/emailController";

const router = Router();

router.post("/schedule", scheduleEmailController);
router.get("/scheduled", getScheduledEmails);
router.get("/sent", getSentEmails);
router.get("/:id", getEmailById);

export default router;