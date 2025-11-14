namespace ChatService.Models
{
    public class UserConnection
    {
        public string ConnectionId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string ChatRoom { get; set; } = string.Empty;
        public DateTime JoinedAt { get; set; }
    }
}
