import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import ChatRoom from "./components/ChatRoom";
import GroupList from "./components/GroupList";

const App = () => {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GroupList />} />
          <Route path="/chat/:groupId" element={<ChatRoom />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default App;
