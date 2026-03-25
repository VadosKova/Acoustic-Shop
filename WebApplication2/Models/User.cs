using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApplication2.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = "";

        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string AvatarUrl { get; set; } = "";

        public List<string> FavoriteProductIds { get; set; } = new();
    }
}