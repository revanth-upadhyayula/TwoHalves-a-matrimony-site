import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default model("Chat", chatSchema);
