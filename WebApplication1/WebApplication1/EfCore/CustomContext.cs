using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.EfCore;

public class CustomContext(DbContextOptions<CustomContext> options) : DbContext(options)
{
    public DbSet<Song> Songs { get; set; }
    public DbSet<SongFile> SongFiles { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=localhost;Database=Test;User Id=sa;Password=yourStrong(!)Password;Encrypt=False;TrustServerCertificate=True;");
    }
}