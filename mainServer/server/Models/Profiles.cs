using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Models
{
    public class Profiles
    {
        [Key]
        public int Profile_Id { get; set; }

        [MaxLength(50)]
        public string? Name { get; set; }

        [MaxLength(50)]
        public string? Surname { get; set; }

        [MaxLength(255)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string? Gender { get; set; }

        public DateTime? Birthday { get; set; }

        [MaxLength(150)]
        public string? Country { get; set; }

        [MaxLength(255)]
        public string? Banner_Url { get; set; }

        [MaxLength(255)]
        public string? Border_Url { get; set; }

        [MaxLength(255)]
        public string? Background_Url { get; set; }

        [MaxLength(255)]
        public string? Avatar_Url { get; set; }

        public DateTime Last_Update_Date { get; set; } = DateTime.Now;
        
        public double Money { get; set; }

        public int? User_Id_Fk { get; set; }

        [ForeignKey("User_Id_Fk")]
        public virtual Users? User { get; set; }
    }
}
