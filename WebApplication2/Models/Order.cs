using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApplication2.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public string UserId { get; set; } = "";
        public string City { get; set; } = "";
        public string Warehouse { get; set; } = "";
        public List<OrderItem> Items { get; set; } = new();
        public decimal TotalPriceEth { get; set; }
        public string Status { get; set; } = "Processing";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class OrderItem
    {
        public string ProductId { get; set; } = "";
        public string Name { get; set; } = "";
        public decimal PriceEth { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; } = "";
    }
}