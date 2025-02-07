import { useChat } from "../context/ChatContext";
import { ListItemText, Paper, Container, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GroupList = () => {
  const { groups, joinGroup, user } = useChat();
  const navigate = useNavigate();

  const handleJoinGroup = (group) => {
    joinGroup(group);
    navigate(`/chat/${group.id}`); // Navigate to specific group's chatroom
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 16 }}>
        <Typography variant="h6">Available Groups</Typography>
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Paper style={{ padding: 8 }}>
                <ListItemText primary={group.name} />
                <Button variant="contained" color="primary" onClick={() => handleJoinGroup(group)}>
                  {user.groupIds.includes(group.id) ? "Enter Chatroom" : "Join & Chat"}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default GroupList;
