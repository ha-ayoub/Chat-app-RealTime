import { HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7076/chat';

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async connect(url = API_URL) {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(LogLevel.Information)
        .build();

      this.connection.onreconnecting(() => {
        console.log('Reconnecting...');
      });

      this.connection.onreconnected(() => {
        console.log('Reconnected successfully');
      });

      this.connection.onclose((error) => {
        console.log('Connection closed', error);
      });

      await this.connection.start();
      console.log('SignalR Connected');
      return true;
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      return false;
    }
  }

  async disconnect() {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      await this.connection.stop();
    }
  }

  async joinRoom(username, roomName) {
    if (!this.connection) return false;
    try {
      return await this.connection.invoke('JoinRoom', username, roomName);
    } catch (error) {
      console.error('JoinRoom error:', error);
      return false;
    }
  }

  async sendMessage(message) {
    if (!this.connection) return;
    try {
      await this.connection.invoke('SendMessage', message);
    } catch (error) {
      console.error('SendMessage error:', error);
    }
  }

  async getAvailableRooms() {
    if (!this.connection) return;
    try {
      await this.connection.invoke('GetAvailableRooms');
    } catch (error) {
      console.error('GetAvailableRooms error:', error);
    }
  }

  onReceiveMessage(callback) {
    if (!this.connection) return;
    this.connection.on('ReceiveMessage', callback);
  }

  onReceiveMessageHistory(callback) {
    if (!this.connection) return;
    this.connection.on('ReceiveMessageHistory', callback);
  }

  onUpdateUserList(callback) {
    if (!this.connection) return;
    this.connection.on('UpdateUserList', callback);
  }

  onUpdateRoomList(callback) {
    if (!this.connection) return;
    this.connection.on('UpdateRoomList', callback);
  }

  off(eventName) {
    if (!this.connection) return;
    this.connection.off(eventName);
  }

  isConnected() {
    return this.connection && this.connection.state === HubConnectionState.Connected;
  }
}

export default new SignalRService();