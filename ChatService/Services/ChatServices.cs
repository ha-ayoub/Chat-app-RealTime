using ChatService.Models;
using System.Collections.Concurrent;

namespace ChatService.Services
{
    public class ChatServices : IChatServices
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connections = new();
        private readonly ConcurrentDictionary<string, List<Message>> _messageHistory = new();
        private readonly object _lock = new();

        public bool AddUser(UserConnection user)
        {
            if (IsUsernameInRoom(user.Username, user.ChatRoom))
                return false;

            user.JoinedAt = DateTime.UtcNow;
            return _connections.TryAdd(user.ConnectionId, user);
        }

        public UserConnection? RemoveUser(string connectionId)
        {
            _connections.TryRemove(connectionId, out var user);
            return user;
        }

        public UserConnection? GetUser(string connectionId)
        {
            _connections.TryGetValue(connectionId, out var user);
            return user;
        }

        public List<string> GetUsersInRoom(string roomName)
        {
            return _connections.Values
                .Where(c => c.ChatRoom.Equals(roomName, StringComparison.OrdinalIgnoreCase))
                .Select(c => c.Username)
                .Distinct()
                .OrderBy(u => u)
                .ToList();
        }

        public int GetUserCountInRoom(string roomName)
        {
            return _connections.Values
                .Count(c => c.ChatRoom.Equals(roomName, StringComparison.OrdinalIgnoreCase));
        }

        public List<ChatRoomInfo> GetAllRooms()
        {
            return _connections.Values
                .GroupBy(c => c.ChatRoom)
                .Select(g => new ChatRoomInfo
                {
                    Name = g.Key,
                    UserCount = g.Count(),
                    Users = g.Select(u => u.Username).Distinct().ToList()
                })
                .OrderByDescending(r => r.UserCount)
                .ToList();
        }

        public void AddMessage(string roomName, Message message)
        {
            lock (_lock)
            {
                if (!_messageHistory.ContainsKey(roomName))
                {
                    _messageHistory[roomName] = new List<Message>();
                }

                _messageHistory[roomName].Add(message);

                if (_messageHistory[roomName].Count > 100)
                {
                    _messageHistory[roomName].RemoveAt(0);
                }
            }
        }

        public List<Message> GetMessageHistory(string roomName)
        {
            _messageHistory.TryGetValue(roomName, out var messages);
            return messages ?? new List<Message>();
        }

        private bool IsUsernameInRoom(string username, string roomName)
        {
            return _connections.Values.Any(c =>
                c.Username.Equals(username, StringComparison.OrdinalIgnoreCase) &&
                c.ChatRoom.Equals(roomName, StringComparison.OrdinalIgnoreCase));
        }
    }
}
