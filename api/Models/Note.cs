using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Note
    {
        [Key]
        public Guid NoteNo { get; set; }


        [Required(ErrorMessage = "Title is required")]
        public string NoteTitle { get; set; }

        [Required(ErrorMessage = "Content is required")]
        public string NoteContents { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(3); // Set current time +3 GMT

        [Required(ErrorMessage = "UserId is required")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public DateTime? DeletedAt { get; set; }

        public bool IsHidden { get; set; } = false;


        public Note()
        {
            NoteNo = Guid.NewGuid();
        }
        public Note(string noteTitle, string noteContents, int userId)
        {
            NoteNo = Guid.NewGuid();
            NoteTitle = noteTitle;
            NoteContents = noteContents;
            UserId = userId;
            CreatedAt = DateTime.UtcNow.AddHours(3);
        }
        
    }
}
