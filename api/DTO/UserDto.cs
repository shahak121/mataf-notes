// UserDto.cs in api.Models

using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int NoteCount { get; set; }

    }
}
