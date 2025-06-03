using Microsoft.EntityFrameworkCore;
using BookStore.Models;

namespace BookStore.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<Users> Users { get; set; }
    public DbSet<Profiles> Profiles { get; set; }
    public DbSet<User_Refills> User_Refills { get; set; }
    public DbSet<Decoration_purchase_history> Decoration_purchase_history { get; set; }
    public DbSet<User_decoration> User_decoration { get; set; }
}
