using MongoDB.Driver;
using WebApplication2.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;

namespace WebApplication2.Services
{
    public class UserMongoService
    {
        private readonly IMongoCollection<User> _users;

        public UserMongoService(
            IMongoClient client,
            IOptions<MongoSettings> settings)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>(settings.Value.UsersCollection);
        }

        public async Task<List<User>> GetAllAsync() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task<User?> GetByEmailAsync(string email) =>
            await _users.Find(x => x.Email == email).FirstOrDefaultAsync();

        public async Task CreateAsync(User user) =>
            await _users.InsertOneAsync(user);

        public async Task SeedAdminAsync()
        {
            var existing = await GetByEmailAsync("admin@gmail.com");

            if (existing == null)
            {
                var hasher = new PasswordHasher<User>();

                var admin = new User
                {
                    Email = "admin@gmail.com",
                    Name = "Admin"
                };

                admin.Password = hasher.HashPassword(admin, "1234");

                await CreateAsync(admin);
            }
        }

        public async Task<User?> GetByIdAsync(string id) =>
            await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task UpdateAsync(string id, User updatedUser) =>
            await _users.ReplaceOneAsync(x => x.Id == id, updatedUser);
    }
}