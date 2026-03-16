using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            user.Id = UserService.Users.Count + 1;

            UserService.Users.Add(user);

            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login(User login)
        {
            var user = UserService.Users
                .FirstOrDefault(x =>
                    x.Email == login.Email &&
                    x.Password == login.Password);

            if (user == null)
                return Unauthorized();

            return Ok(user);
        }
    }
}
