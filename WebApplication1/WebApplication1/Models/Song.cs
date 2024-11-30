using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models;

public class Song
{
    [Key]
    public string SongToken { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Listenings { get; set; }
}