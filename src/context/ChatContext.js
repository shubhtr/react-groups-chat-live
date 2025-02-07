import { createContext, useContext, useState } from "react";

// Sample users to populate groups
const sampleUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" }
];

// Generate some default messages
const generateDefaultMessages = (groupId) => [
  { id: 101, text: "Welcome to the chat!", sender: "Admin", timestamp: new Date().toLocaleTimeString() },
  { id: 102, text: `This is the ${groupId} chat room. Feel free to chat!`, sender: "Admin", timestamp: new Date().toLocaleTimeString() }
];

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [groups, setGroups] = useState([
    { id: 1, name: "React Developers", users: [sampleUsers[0], sampleUsers[1]], messages: generateDefaultMessages(1) },
    { id: 2, name: "JavaScript Enthusiasts", users: [sampleUsers[2], sampleUsers[3]], messages: generateDefaultMessages(2) },
    { id: 3, name: "Node.js Community", users: [sampleUsers[0], sampleUsers[2]], messages: generateDefaultMessages(3) }
  ]);
  const [currentGroup, setCurrentGroup] = useState(null);

  const setMessagesForGroup = (groupId, newMessages) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, messages: newMessages } : group
      )
    );
  };

  return (
    <ChatContext.Provider value={{ groups, setGroups, currentGroup, setCurrentGroup, setMessagesForGroup }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
