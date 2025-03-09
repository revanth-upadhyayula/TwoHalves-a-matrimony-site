const setupChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("sendMessage", (data) => {
            io.emit("receiveMessage", data); // Broadcast to all clients
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};

export default setupChatSocket;
