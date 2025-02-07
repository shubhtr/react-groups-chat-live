import { createContext, useContext, useState } from "react";

// Global unique user list
const globalUsers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
  { id: 5, name: "Eve" },
  { id: 6, name: "Frank" },
  { id: 7, name: "Grace" },
  { id: 8, name: "Hank" },
  { id: 9, name: "Ivy" },
  { id: 10, name: "Jack" },
];

// Function to randomly select unique users per group
const getRandomUsersForGroup = (count) => {
  const shuffledUsers = [...globalUsers].sort(() => Math.random() - 0.5);
  return shuffledUsers.slice(0, count);
};

// Random messages list
const randomMessages = [
  "Hello everyone!",
  "How's it going?",
  "React is amazing!",
  "Did anyone try the new JavaScript feature?",
  "What's the best way to learn Node.js?",
  "I love coding!",
  "This chat is awesome!",
  "What's everyone working on today?",
];

// Function to get a random message from a user in the chatroom
const getRandomMessage = (users) => {
  const user = users[Math.floor(Math.random() * users.length)];
  return {
    id: Date.now(),
    text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
    sender: user.name,
    timestamp: new Date().toLocaleTimeString(),
  };
};

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({}); // Stores messages per group
  const [groups, setGroups] = useState([
    { id: 1, name: "React Developers", users: getRandomUsersForGroup(4) },
    { id: 2, name: "JavaScript Enthusiasts", users: getRandomUsersForGroup(4) },
    { id: 3, name: "Node.js Community", users: getRandomUsersForGroup(4) },
  ]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [user, setUser] = useState({ id: 999, name: "You", groupIds: [] });

  const joinGroup = (group) => {
    if (!user.groupIds.includes(group.id)) {
      setUser((prevUser) => ({
        ...prevUser,
        groupIds: [...prevUser.groupIds, group.id],
      }));

      setGroups((prevGroups) =>
        prevGroups.map((g) =>
          g.id === group.id && !g.users.find((u) => u.id === user.id)
            ? { ...g, users: [...g.users, user] }
            : g
        )
      );
    }
    setCurrentGroup(group);

    // Add a few random messages from unique users in that group
    const newMessages = Array.from({ length: Math.floor(Math.random() * 5) + 2 }).map(() =>
      getRandomMessage(group.users)
    );

    setMessages((prevMessages) => ({
      ...prevMessages,
      [group.id]: [...(prevMessages[group.id] || []), ...newMessages],
    }));
  };

  const sendMessage = (groupId, newMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [groupId]: [
        ...(prevMessages[groupId] || []),
        { id: Date.now(), text: newMessage, sender: user.name, timestamp: new Date().toLocaleTimeString() },
      ],
    }));
  };

  return (
    <ChatContext.Provider value={{ messages, setMessages, groups, setCurrentGroup, currentGroup, joinGroup, sendMessage, user }}>
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
