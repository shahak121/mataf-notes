// NotePatchDto.cs
namespace api.Models
{
    public class NotePatchDto
    {
        public string NoteTitle { get; set; }
        public string NoteContents { get; set; }
        public DateTime? DeletedAt { get; set; }
        public int? UserId { get; set; }
    }
}
