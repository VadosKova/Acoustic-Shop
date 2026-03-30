using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;
using Microsoft.AspNetCore.Identity;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserMongoService _userService;
        private readonly PasswordHasher<User> _passwordHasher = new();

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

            user.Password = _passwordHasher.HashPassword(user, user.Password);

            await _userService.CreateAsync(user);

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User login)
        {
            var user = await _userService.GetByEmailAsync(login.Email);

            if (user == null)
                return Unauthorized();

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.Password,
                login.Password
            );

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized();

            return Ok(user);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var user = await _userService.GetByIdAsync(userId);

            if (user == null) return NotFound();

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