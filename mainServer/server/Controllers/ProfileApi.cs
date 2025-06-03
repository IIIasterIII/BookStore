using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.Data;
using BookStore.Models;
using BookStore.DTOs;
using BookStore.Dtos;
using System.Threading.Tasks;

namespace BookStore.Controllers;

[ApiController]
public class Profile(AppDbContext globalContext) : ControllerBase
{
    private readonly AppDbContext _context = globalContext;

    [HttpGet("profile/{username}")]
    public async Task<IActionResult> GetProfile(string username)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Username == username);

        if (user == null || user.Profile == null)
            return NotFound();

        var profileDto = new ProfileDTO
        {
            Username = user.Username,
            Email = user.Email,
            Profile_Id = user.Profile.Profile_Id,
            Name = user.Profile.Name,
            Surname = user.Profile.Surname,
            Description = user.Profile.Description,
            Gender = user.Profile.Gender,
            Birthday = user.Profile.Birthday,
            Country = user.Profile.Country,
            Banner_Url = user.Profile.Banner_Url,
            Border_Url = user.Profile.Border_Url,
            Background_Url = user.Profile.Background_Url,
            Avatar_Url = user.Profile.Avatar_Url,
            Money = user.Profile.Money,
            Last_Update_Date = user.Profile.Last_Update_Date
        };

        return Ok(profileDto);
    }

    [HttpPost("profile/{id}")]
    public async Task<IActionResult> PostPersonalInfo(int id, [FromBody] PersonalDataInformationDto data)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.User_Id == id);

        if (user == null)
            return NotFound("User not found");

        if (user.Profile == null)
            return NotFound("Profile not found");
        
        if(data.Username == null)
            return NotFound("Username is void");

        DateTime? birthday = null;
        if (!string.IsNullOrEmpty(data.Birthday)){

            if (DateTime.TryParse(data.Birthday, out DateTime parsedDate))
                birthday = parsedDate;
            else
                return BadRequest("Invalid date format for birthday.");
        }

        user.Username = data.Username;
        user.Profile.Gender = data.Gender;
        user.Profile.Name = data.Name;
        user.Profile.Surname = data.Surname;
        user.Profile.Description = data.Description?.Trim();
        user.Profile.Birthday = birthday;
        user.Profile.Country = data.Country;
        user.Profile.Last_Update_Date = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully." , data = data.Username});
    }

    [HttpPost("avatar/{id}")]
    public async Task<IActionResult> SetAvatar(int id, [FromBody] string avatarUrl)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.User_Id == id);
        if (user == null || user.Profile == null)
            return NotFound("User or profile not found");

        user.Profile.Avatar_Url = avatarUrl;
        user.Profile.Last_Update_Date = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Avatar updated successfully." });
    }

    [HttpPost("border/{id}")]
    public async Task<IActionResult> SetBorder(int id, [FromBody] string borderUrl)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.User_Id == id);
        if (user == null || user.Profile == null)
            return NotFound("User or profile not found");

        user.Profile.Border_Url = borderUrl;
        user.Profile.Last_Update_Date = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Border updated successfully." });
    }

    [HttpGet("profile/top-rich")]
    public async Task<IActionResult> GetTopRichProfiles()
    {
        var topUsers = await _context.Users
            .Include(u => u.Profile)
            .Where(u => u.Profile != null)
            .OrderByDescending(u => u.Profile.Money)
            .Take(6)
            .Select(u => new ProfileDTO
            {
                Username = u.Username,
                Email = u.Email,
                Profile_Id = u.Profile.Profile_Id,
                Name = u.Profile.Name,
                Surname = u.Profile.Surname,
                Description = u.Profile.Description,
                Gender = u.Profile.Gender,
                Birthday = u.Profile.Birthday,
                Country = u.Profile.Country,
                Banner_Url = u.Profile.Banner_Url,
                Border_Url = u.Profile.Border_Url,
                Background_Url = u.Profile.Background_Url,
                Avatar_Url = u.Profile.Avatar_Url,
                Money = u.Profile.Money,
                Last_Update_Date = u.Profile.Last_Update_Date
            })
            .ToListAsync();

        return Ok(topUsers);
    }


    [HttpPost("banner/{id}")]
    public async Task<IActionResult> SetBanner(int id, [FromBody] string bannerUrl)
    {
        var user = await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.User_Id == id);
        if (user == null || user.Profile == null)
            return NotFound("User or profile not found");

        user.Profile.Banner_Url = bannerUrl;
        user.Profile.Last_Update_Date = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Banner updated successfully." });
    }

}
