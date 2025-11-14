namespace ChatService.Models
{
    public class ChatRoomInfo
    {
        public string Name { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public List<string> Users { get; set; } = new();
    }
}
