import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { TextField, Button, Paper, Typography, Container, Box, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const ChatRoom = () => {
  const { messages, sendMessage, groups, setCurrentGroup, currentGroup } = useChat();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  // Ensure group is set
  useEffect(() => {
    const group = groups.find((g) => g.id === Number(groupId));
    if (!group) {
      navigate("/");
    } else {
      setCurrentGroup(group);
    }
  }, [groupId, groups, setCurrentGroup, navigate]);

  // Simulate random users typing
  useEffect(() => {
    if (!currentGroup) return;

    if (newMessage.trim() !== "") {
      const randomUser = currentGroup.users.find((u) => u.name !== "You");
      if (randomUser) {
        setTypingUsers((prev) => new Set(prev).add(randomUser.name));

        const timeout = setTimeout(() => {
          setTypingUsers((prev) => {
            const updated = new Set(prev);
            updated.delete(randomUser.name);
            return updated;
          });
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }
  }, [newMessage, currentGroup]);

  // Handle user typing indicator
  useEffect(() => {
    if (!currentGroup) return;

    if (newMessage.trim() === "") {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete("You");
        return updated;
      });
    } else {
      setTypingUsers((prev) => new Set(prev).add("You"));

      const timeout = setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete("You");
          return updated;
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [newMessage, currentGroup]);

  if (!currentGroup) return null; // Ensure component does not break if group is not set

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(currentGroup.id, newMessage);
      setNewMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>{currentGroup.name}</Typography>
      <Paper style={{ padding: 16, maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {(messages[currentGroup.id] || []).map((msg) => (
          <Box
            key={msg.id}
            style={{
              margin: "8px 0",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: msg.sender === "You" ? "#DCF8C6" : "#EAEAEA",
              alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              <strong>{msg.sender}</strong> ({msg.timestamp})
            </Typography>
            <Typography>{msg.text}</Typography>
          </Box>
        ))}

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <Box style={{ padding: "8px", fontStyle: "italic", color: "#666" }}>
            {Array.from(typingUsers).join(", ")} is typing...
          </Box>
        )}
      </Paper>

      <TextField
        fullWidth
        label="Type a message"
        variant="outlined"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ marginTop: 16 }}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginTop: 8, marginRight: 8 }}>
        Send
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => setUserDialogOpen(true)} style={{ marginTop: 8 }}>
        View Users
      </Button>

      {/* User List Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
        <DialogTitle>Users in {currentGroup.name}</DialogTitle>
        <DialogContent>
          <List>
            {currentGroup.users.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ChatRoom;
