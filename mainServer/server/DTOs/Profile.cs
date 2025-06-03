namespace BookStore.DTOs
{
    public class ProfileDTO
    {
        public string? Username {get; set; }
        public string? Email {get; set; }
        public int Profile_Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Description { get; set; }
        public string? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Country { get; set; }
        public string? Banner_Url { get; set; }
        public string? Border_Url { get; set; }
        public string? Background_Url { get; set; }
        public double Money { get; set; }
        public string? Avatar_Url { get; set; }
        public DateTime Last_Update_Date { get; set; }
    }
}
