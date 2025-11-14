using ChatService.Models;

namespace ChatService.Services
{
    public interface IChatServices
    {
        bool AddUser(UserConnection user);
        UserConnection? RemoveUser(string connectionId);
        UserConnection? GetUser(string connectionId);
        List<string> GetUsersInRoom(string roomName);
        int GetUserCountInRoom(string roomName);
        List<ChatRoomInfo> GetAllRooms();
        void AddMessage(string roomName, Message message);
        List<Message> GetMessageHistory(string roomName);

    }
}
