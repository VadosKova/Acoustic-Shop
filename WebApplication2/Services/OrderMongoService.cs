using MongoDB.Driver;
using Microsoft.Extensions.Options;
using WebApplication2.Models;

namespace WebApplication2.Services
{
    public class OrderMongoService
    {
        private readonly IMongoCollection<Order> _orders;

        public OrderMongoService(
            IMongoClient client,
            IOptions<MongoSettings> settings)
        {
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _orders = db.GetCollection<Order>(settings.Value.OrdersCollection);
        }

        public async Task CreateAsync(Order order) =>
            await _orders.InsertOneAsync(order);

        public async Task<List<Order>> GetByUserAsync(string userId) =>
            await _orders.Find(x => x.UserId == userId).ToListAsync();

        public async Task<List<Order>> GetAllAsync() =>
            await _orders.Find(_ => true).ToListAsync();

        public async Task UpdateStatusAsync(string id, string status)
        {
            var update = Builders<Order>.Update.Set(o => o.Status, status);

            await _orders.UpdateOneAsync(o => o.Id == id, update);
        }
    }
}