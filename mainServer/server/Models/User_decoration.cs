using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Models
{
    public class User_decoration
    {
        [Key]
        public int Id_u_d { get; set; }

        [Required]
        public string? Item_Url { get; set; }

        [Required]
        public string? Type { get; set; }

        [Required]
        public int User_Id_Fk { get; set; }

        [ForeignKey("User_id_fk")]
        public Users? User { get; set; }
    }
}
