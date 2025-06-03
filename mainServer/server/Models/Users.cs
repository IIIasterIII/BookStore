using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore.Models
{
    public class Users
    {
        [Key]
        public int User_Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string Hash_Password { get; set; } = null!;

        public DateTime Registered_At { get; set; } = DateTime.Now;
        
        [JsonIgnore]
        public virtual Profiles? Profile { get; set; }
    }
}
