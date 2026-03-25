using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserMongoService _userService;

        public AuthController(UserMongoService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            var existing = await _userService.GetByEmailAsync(user.Email);

            if (existing != null)
                return BadRequest("User already exists");

            await _userService.CreateAsync(user);

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User login)
        {
            var user = await _userService.GetByEmailAsync(login.Email);

            if (user == null || user.Password != login.Password)
                return Unauthorized();

            return Ok(user);
        }

        [HttpPost("favorite/{userId}/{productId}")]
        public async Task<IActionResult> AddFavorite(string userId, string productId)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user == null) return NotFound();

            if (user.FavoriteProductIds == null)
                user.FavoriteProductIds = new List<string>();

            if (!user.FavoriteProductIds.Contains(productId))
                user.FavoriteProductIds.Add(productId);

            await _userService.UpdateAsync(userId, user);

            return Ok(user);
        }

        [HttpDelete("favorite/{userId}/{productId}")]
        public async Task<IActionResult> RemoveFavorite(string userId, string productId)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user == null) return NotFound();

            if (user.FavoriteProductIds.Contains(productId))
                user.FavoriteProductIds.Remove(productId);

            await _userService.UpdateAsync(userId, user);

            return Ok(user);
        }
    }
}