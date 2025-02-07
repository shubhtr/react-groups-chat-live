import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { 
  List, ListItem, ListItemText, Paper, Container, Typography, Button, Box, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const GroupList = () => {
  const { groups, setCurrentGroup } = useChat();
  const navigate = useNavigate();
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const joinGroup = (group) => {
    setCurrentGroup(group);
    navigate(`/chat/${group.id}`);
  };

  const viewUsers = (group) => {
    setSelectedGroup(group);
    setOpen(true);
  };

  return (
    <Container maxWidth="sm" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
      <Paper style={{ padding: 16, width: "100%" }}>
        <Typography variant="h6" align="center">Available Groups</Typography>
        <List style={{ width: "100%" }}>
          {groups.map((group) => (
            <ListItem 
              key={group.id} 
              style={{ marginBottom: 8, borderRadius: 8, background: "#f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <ListItemText primary={group.name} />
              <Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => joinGroup(group)} 
                  style={{ marginRight: 8 }}
                >
                  Join
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={() => viewUsers(group)}
                >
                  View Users
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* User List Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Users in {selectedGroup?.name}</DialogTitle>
        <DialogContent>
          {selectedGroup?.users?.length ? (
            <List>
              {selectedGroup.users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No users in this group yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GroupList;
