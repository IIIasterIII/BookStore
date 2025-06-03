using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.Data;
using BookStore.Models;
using BookStore.DTOs;
using BookStore.Dtos;


namespace BookStore.Controllers;

[ApiController]
[Route("refill")]
public class RefillController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    public class RefillDto
    {
        public double Sum { get; set; }
        public int Euro { get; set; }
    }

    [HttpPost("{userId}")]
    public async Task<IActionResult> RefillBalance(int userId, [FromBody] RefillDto dto)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.User_Id == userId);
        if (user == null) return NotFound("User not found");

        var refill = new User_Refills
        {
            Sum = dto.Sum,
            Euro = dto.Euro,
            Date = DateTime.UtcNow,
            User = user
        };

        await _context.User_Refills.AddAsync(refill);

        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.User_Id_Fk == userId);
        if (profile == null) return NotFound("Profile not found");

        profile.Money += dto.Sum;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Refill successful", dto.Sum });
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetHistory(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.User_Id == userId);
        if (user == null) return NotFound("User not found");

        var refills = await _context.User_Refills
            .Where(r => r.User_Id_Fk == userId)
            .Select(r => new RefillHistoryDto
            {
                Id_r = r.Id_r,
                Sum = r.Sum,
                Date = r.Date,
                Euro = r.Euro
            })
            .ToListAsync();

        return Ok(refills);
    }

    [HttpGet("/decoration/{userId}")]
    public async Task<IActionResult> GetDecoration(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.User_Id == userId);
        if (user == null) return NotFound("User not found");

        var decorations = await _context.User_decoration
            .Where(d => d.User_Id_Fk == userId)
            .Select(el => new Decoration
            {
                User_d = el.Id_u_d,
                User_id = el.User_Id_Fk,
                Type = el.Type,
                Item_Url = el.Item_Url
            })
            .ToListAsync();

        return Ok(decorations);
    }

    [HttpGet("/purchase/{userId}")]
    public async Task<IActionResult> GetPurchase(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.User_Id == userId);
        if (user == null) return NotFound("User not found");

        var purchase = await _context.Decoration_purchase_history
            .Where(d => d.User_Id_Fk == userId)
            .Select(el => new Purchase
            {
                Id_p = el.Int_d_p_h,
                Date = el.Date,
                User_id = el.User_Id_Fk,
                Item_id = el.Item_Id,
                Sum = el.Sum
            })
            .ToListAsync();

        return Ok(purchase);
    }
}
