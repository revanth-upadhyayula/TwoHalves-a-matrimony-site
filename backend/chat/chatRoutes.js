import { Router } from "express";
import { saveMessage, getMessages } from "./chatController.js";

const router = Router();

router.post("/send", saveMessage);
router.get("/messages/:senderId/:receiverId", getMessages);

export default router;
