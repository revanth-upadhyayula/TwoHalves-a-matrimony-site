import Chat from "../models/Chat.js"; // Ensure Chat model exists

// Save chat message to the database
export const saveMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        const newMessage = new Chat({ senderId, receiverId, message });
        await newMessage.save();
        res.status(200).json({ success: true, message: "Message saved" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get chat history between two users
export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ createdAt: 1 }); // Use createdAt if timestamps are enabled

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
