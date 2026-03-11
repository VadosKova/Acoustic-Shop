using WebApplication2.Models;

namespace WebApplication2.Services
{
    public static class UserService
    {
        public static List<User> Users = new()
        {
            new User
            {
                Id = 1,
                Email = "admin@mail.com",
                Password = "1234",
                Role = "Admin"
            }
        };
    }
}
