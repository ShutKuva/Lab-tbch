using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.EfCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("[controller]")]
public class SongController : ControllerBase
{
    private readonly CustomContext _context;

    public SongController(CustomContext context)
    {
        _context = context;
    }
    
    [HttpPost]
    public async Task<IActionResult> AddSong(Song song)
    {
        await _context.Songs.AddAsync(song);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{token}/file")]
    public async Task<IActionResult> AddSongFile(string token, IFormFile file)
    {
        var fileStream = file.OpenReadStream();
        var ms = new MemoryStream();
        await fileStream.CopyToAsync(ms);

        await _context.SongFiles.AddAsync(new SongFile
        {
            SongToken = token,
            File = ms.ToArray()
        });
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet]
    public IActionResult GetSongs()
    {
        return Ok(_context.Songs);
    }

    [HttpGet("{token}")]
    public async Task<IActionResult> GetSong(string token)
    {
        return Ok(await _context.Songs.FirstOrDefaultAsync(song => song.SongToken == token));
    }

    [HttpGet("{token}/file")]
    public async Task<IActionResult> GetSongFile(string token)
    {
        var songFile = await _context.SongFiles.FirstOrDefaultAsync(song => song.SongToken == token);
        if (songFile == null)
            return NotFound();
        return File(songFile.File, "audio/mpeg");
    }

    [HttpPatch("{token}")]
    public async Task<IActionResult> AddListening(string token)
    {
        var song = await _context.Songs.FirstOrDefaultAsync(song => song.SongToken == token);
        if (song is null)
        {
            return BadRequest($"There is no song with token {token}");
        }
        song.Listenings++;
        await _context.SaveChangesAsync();
        return Ok();
    }
}