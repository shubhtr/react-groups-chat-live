import { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Paper, Typography, Container, Box } from "@mui/material";

const POLLING_INTERVAL = 3000;
const RANDOM_MESSAGE_INTERVAL = 5000;

const randomMessages = [
  "Hey there! 👋",
  "How's everyone doing?",
  "Any cool projects you're working on?",
  "I love React! 🚀",
  "Node.js is amazing!",
  "Who else is excited about AI?",
  "Just learned something new today! 😃",
  "Frontend or Backend, what’s your favorite?"
];

const getRandomMessage = () => randomMessages[Math.floor(Math.random() * randomMessages.length)];

const ChatRoom = () => {
  const { groups, currentGroup, setMessagesForGroup } = useChat();
  const navigate = useNavigate();
  const [groupMessages, setGroupMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("You");
  const messagesEndRef = useRef(null);

  // Load messages when the component mounts or when currentGroup changes
  useEffect(() => {
    if (!currentGroup) return;

    const savedMessages = JSON.parse(localStorage.getItem(`chat_${currentGroup.id}`)) || [];
    setGroupMessages(savedMessages);
  }, [currentGroup]);

  // Poll for new messages every few seconds
  useEffect(() => {
    if (!currentGroup) return;

    const pollingInterval = setInterval(() => {
      const updatedMessages = JSON.parse(localStorage.getItem(`chat_${currentGroup.id}`)) || [];
      setGroupMessages(updatedMessages);
    }, POLLING_INTERVAL);

    return () => clearInterval(pollingInterval);
  }, [currentGroup]);

  // Simulate random user messages at intervals
  useEffect(() => {
    if (!currentGroup) return;

    const sendRandomMessage = () => {
      const group = groups.find((g) => g.id === currentGroup.id);
      if (!group || !group.users) return;

      const randomUser = group.users.find((user) => user.name !== "You");
      if (!randomUser) return;

      const newMsg = {
        id: Date.now(),
        text: getRandomMessage(),
        sender: randomUser.name,
        timestamp: new Date().toLocaleTimeString()
      };

      setGroupMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMsg];
        setMessagesForGroup(currentGroup.id, updatedMessages);
        localStorage.setItem(`chat_${currentGroup.id}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    };

    const randomMsgInterval = setInterval(sendRandomMessage, RANDOM_MESSAGE_INTERVAL);

    return () => clearInterval(randomMsgInterval);
  }, [currentGroup, groups, setMessagesForGroup]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: username,
        timestamp: new Date().toLocaleTimeString()
      };

      setGroupMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMsg];
        setMessagesForGroup(currentGroup.id, updatedMessages);
        localStorage.setItem(`chat_${currentGroup.id}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setNewMessage("");
    }
  };

  if (!currentGroup) {
    return (
      <Container maxWidth="sm">
        <Paper style={{ padding: 16 }}>
          <Typography variant="h6">Please select a group to join.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      {/* Chatroom Header with Group Name & Back Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{currentGroup.name}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
        >
          ← Back to Groups
        </Button>
      </Box>

      <Paper
        style={{
          padding: 16,
          height: 400,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {groupMessages.map((msg) => (
          <Box
            key={msg.id}
            style={{
              margin: "8px 0",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: msg.sender === username ? "#DCF8C6" : "#EAEAEA",
              alignSelf: msg.sender === username ? "flex-end" : "flex-start"
            }}
          >
            <Typography variant="body2" color="textSecondary">
              <strong>{msg.sender}</strong> ({msg.timestamp})
            </Typography>
            <Typography>{msg.text}</Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      <TextField
        fullWidth
        label="Type a message"
        variant="outlined"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ marginTop: 16 }}
      />
      <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: 8 }}>
        Send
      </Button>
    </Container>
  );
};

export default ChatRoom;
