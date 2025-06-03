using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Models
{
    public class Decoration_purchase_history
    {
        [Key]
        public int Int_d_p_h { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string? Item_Id { get; set; }

        [Required]
        public double Sum { get; set; }

        [Required]
        public int User_Id_Fk { get; set; }

        [ForeignKey("User_id_fk")]
        public Users? User { get; set; }
    }
}
