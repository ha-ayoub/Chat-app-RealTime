using ChatService.Models;
using ChatService.Services;
using Microsoft.AspNetCore.SignalR;

namespace ChatService.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatServices _chatServices;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(IChatServices chatServices, ILogger<ChatHub> logger)
        {
            _chatServices = chatServices;
            _logger = logger;
        }

        public async Task<bool> JoinRoom(string username, string roomName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(roomName))
                {
                    _logger.LogWarning("Invalid join attempt with empty username or room");
                    return false;
                }

                if (username.Length < 3 || username.Length > 20)
                {
                    _logger.LogWarning("Username length invalid: {Username}", username);
                    return false;
                }

                var userConnection = new UserConnection
                {
                    ConnectionId = Context.ConnectionId,
                    Username = username.Trim(),
                    ChatRoom = roomName.Trim()
                };

                if (!_chatServices.AddUser(userConnection))
                {
                    _logger.LogWarning("Username already exists in room: {Username} in {Room}", username, roomName);
                    return false;
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

                var joinMessage = new Message
                {
                    Username = "Système",
                    Content = $"{username} a rejoint la salle",
                    Timestamp = DateTime.UtcNow,
                    IsSystemMessage = true
                };
                _chatServices.AddMessage(roomName, joinMessage);

                var history = _chatServices.GetMessageHistory(roomName);
                await Clients.Caller.SendAsync("ReceiveMessageHistory", history);

                await Clients.Group(roomName).SendAsync("ReceiveMessage", joinMessage);

                var users = _chatServices.GetUsersInRoom(roomName);
                await Clients.Group(roomName).SendAsync("UpdateUserList", users);

                await UpdateAllRoomsList();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in JoinRoom");
                return false;
            }
        }

        public async Task SendMessage(string message)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(message) || message.Length > 500)
                {
                    return;
                }

                var user = _chatServices.GetUser(Context.ConnectionId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for connection: {ConnectionId}", Context.ConnectionId);
                    return;
                }

                var chatMessage = new Message
                {
                    Username = user.Username,
                    Content = message.Trim(),
                    Timestamp = DateTime.UtcNow,
                    IsSystemMessage = false
                };

                _chatServices.AddMessage(user.ChatRoom, chatMessage);

                await Clients.Group(user.ChatRoom).SendAsync("ReceiveMessage", chatMessage);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SendMessage");
            }
        }

        public async Task GetAvailableRooms()
        {
            try
            {
                var rooms = _chatServices.GetAllRooms();
                await Clients.Caller.SendAsync("UpdateRoomList", rooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAvailableRooms");
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            try
            {
                var user = _chatServices.RemoveUser(Context.ConnectionId);

                if (user != null)
                {
                    var leaveMessage = new Message
                    {
                        Username = "Système",
                        Content = $"{user.Username} a quitté la salle",
                        Timestamp = DateTime.UtcNow,
                        IsSystemMessage = true
                    };
                    _chatServices.AddMessage(user.ChatRoom, leaveMessage);

                    await Clients.Group(user.ChatRoom).SendAsync("ReceiveMessage", leaveMessage);

                    var users = _chatServices.GetUsersInRoom(user.ChatRoom);
                    await Clients.Group(user.ChatRoom).SendAsync("UpdateUserList", users);

                    await UpdateAllRoomsList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in OnDisconnectedAsync");
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async Task UpdateAllRoomsList()
        {
            var rooms = _chatServices.GetAllRooms();
            await Clients.All.SendAsync("UpdateRoomList", rooms);
        }
    }
}
