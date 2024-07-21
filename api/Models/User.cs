using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone is required")]
        public string Phone { get; set; }

        // Navigation property to Notes
        public virtual ICollection<Note> Notes { get; set; } = new List<Note>();

        public int CountUnhiddenNotes()
        {
            return Notes.Count(n => !n.IsHidden);
        }
    }
}
