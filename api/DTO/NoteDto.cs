public class NoteDTO
{
    public Guid NoteNo { get; set; }
    public string NoteTitle { get; set; }
    public string NoteContents { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public DateTime? DeletedAt { get; set; }
}
