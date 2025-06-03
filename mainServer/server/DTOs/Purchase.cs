namespace BookStore.DTOs
{
    public class Purchase
    {
        public int Id_p { get; set; }
        public DateTime Date  { get; set; }
        public int User_id { get; set; }
        public string? Item_id { get; set; }
        public double Sum { get; set; }
    }
}
