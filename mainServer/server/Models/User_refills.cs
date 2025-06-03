using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Models
{
    public class User_Refills
    {
        [Key]
        public int Id_r { get; set; }

        [Required]
        public double Sum { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int Euro { get; set; }

        [Required]
        public int User_Id_Fk { get; set; }

        [ForeignKey(nameof(User_Id_Fk))]
        public Users User { get; set; } = null!;
    }
}
