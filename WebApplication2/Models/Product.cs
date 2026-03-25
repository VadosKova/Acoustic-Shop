using Microsoft.AspNetCore.Mvc.ViewEngines;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApplication2.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = "";

        public string Name { get; set; } = "";
        public string Category { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public double Rating { get; set; }
        public double BaseRating { get; set; } = 0;
        public decimal PriceEth { get; set; }

        public string Description { get; set; } = "";
        public bool InStock { get; set; } = true;

        public ProductSpecs Specs { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();

        public int ReviewsCount => Reviews.Count;
    }

    public class ProductSpecs
    {
        public string Material { get; set; } = "";
        public string Color { get; set; } = "";
        public int Quantity { get; set; }
        public string Seller { get; set; } = "";
    }

    public class Review
    {
        public string Name { get; set; } = "Anonymous";
        public double Rating { get; set; }
        public string Comment { get; set; } = "";
    }
}