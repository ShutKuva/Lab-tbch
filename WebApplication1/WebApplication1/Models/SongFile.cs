using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class SongFile
    {
        [Key]
        [ForeignKey("Song")]
        public string SongToken { get; set; } = string.Empty;
        public byte[] File { get; set; } = null!;

        public Song Song { get; set; } = null!;
    }
}
