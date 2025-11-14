import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useChat } from './hooks/useChat';
import LoginForm from './components/auth/LoginForm';
import ChatRoom from './components/chat/ChatRoom';
import Loader from './components/common/Loader';
import { useEffect } from 'react';

function App() {
  const {
    currentUser,
    currentRoom,
    messages,
    users,
    rooms,
    error,
    isJoining,
    messagesEndRef,
    joinRoom,
    sendMessage,
    leaveRoom,
    initConnection
  } = useChat();

  useEffect(() => {
    initConnection();
  }, [initConnection]);

  if (currentUser && currentRoom) {
    return (
      <ChatRoom
        currentUser={currentUser}
        currentRoom={currentRoom}
        messages={messages}
        users={users}
        onSendMessage={sendMessage}
        onLeaveRoom={leaveRoom}
        messagesEndRef={messagesEndRef}
      />
    );
  }
  return (
    <LoginForm
      onJoin={joinRoom}
      isJoining={isJoining}
      error={error}
      rooms={rooms}
    />
  );
}

export default App;
