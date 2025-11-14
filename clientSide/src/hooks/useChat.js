import { useState, useEffect, useCallback, useRef } from 'react';
import signalRService from '../services/signalRService';

export const useChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const initConnection = useCallback(async () => {
    try {
      const connected = await signalRService.connect();
      setIsConnected(connected);
      
      if (connected) {
        signalRService.onReceiveMessage((message) => {
          setMessages(prev => [...prev, message]);
        });

        signalRService.onReceiveMessageHistory((history) => {
          setMessages(history);
        });

        signalRService.onUpdateUserList((userList) => {
          setUsers(userList);
        });

        signalRService.onUpdateRoomList((roomList) => {
          setRooms(roomList);
        });

        await signalRService.getAvailableRooms();
      }

      return connected;
    } catch (err) {
      setError('Unable to connect to the server', err);
      return false;
    }
  }, []);

  const joinRoom = useCallback(async (username, roomName) => {
    setIsJoining(true);
    setError(null);

    try {
      if (!isConnected) {
        const connected = await initConnection();
        if (!connected) {
          throw new Error('Connection failed');
        }
      }

      const success = await signalRService.joinRoom(username, roomName);
      
      if (success) {
        setCurrentUser(username);
        setCurrentRoom(roomName);
        return true;
      } else {
        setError('This username is already in use in this room.');
        return false;
      }
    } catch (err) {
      setError('Error connecting to the room', err);
      return false;
    } finally {
      setIsJoining(false);
    }
  }, [isConnected, initConnection]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    
    try {
      await signalRService.sendMessage(message);
    } catch (err) {
      setError('Error sending message', err);
    }
  }, []);

  const leaveRoom = useCallback(async () => {
    await signalRService.disconnect();
    setCurrentUser(null);
    setCurrentRoom(null);
    setMessages([]);
    setUsers([]);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      signalRService.disconnect();
    };
  }, []);

  return {
    isConnected,
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
  };
};