using MongoDB.Driver;
using WebApplication2.Models;
using Microsoft.Extensions.Options;

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
                await CreateAsync(new User
                {
                    Email = "admin@gmail.com",
                    Password = "1234",
                    Name = "Admin"
                });
            }
        }

        public async Task<User?> GetByIdAsync(string id) =>
            await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task UpdateAsync(string id, User updatedUser) =>
            await _users.ReplaceOneAsync(x => x.Id == id, updatedUser);
    }
}