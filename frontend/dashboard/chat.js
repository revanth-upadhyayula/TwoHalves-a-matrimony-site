const socket = io("http://localhost:5500");

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

// Assume these values come from the profile page or authentication session
const senderName = localStorage.getItem("loggedInUser"); // Get from local storage or session
const receiverName = localStorage.getItem("chatRecipient"); // Get from local storage or session

if (!senderName || !receiverName) {
    console.error("Missing sender or receiver information.");
}

// Function to send a chat message
sendButton.addEventListener("click", async () => {
    const message = chatInput.value.trim();
    if (message) {
        // Save message to database
        await fetch("http://localhost:5000/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderId: senderName, receiverId: receiverName, message }),
        });

        // Emit real-time message
        socket.emit("sendMessage", { sender: senderName, receiver: receiverName, message });

        // Display sent message
        displayMessage(senderName, message, "sent");

        chatInput.value = "";
    }
});

// Function to load chat history
async function loadMessages(sender, receiver) {
    const response = await fetch(`http://localhost:5000/chat/messages/${sender}/${receiver}`);
    const messages = await response.json();

    chatBox.innerHTML = ""; // Clear existing messages
    messages.forEach(msg => {
        displayMessage(msg.senderId, msg.message, msg.senderId === senderName ? "sent" : "received");
    });
}

// Function to display messages in chat
function displayMessage(sender, message, type) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = `${sender}: ${message}`;
    msgDiv.classList.add(type === "sent" ? "sent-message" : "received-message");
    chatBox.appendChild(msgDiv);
}

// Listen for incoming messages
socket.on("receiveMessage", (data) => {
    if (data.receiver === senderName) {
        displayMessage(data.sender, data.message, "received");
    }
});

// Load messages on page load
loadMessages(senderName, receiverName);
