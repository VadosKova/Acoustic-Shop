namespace WebApplication2.Models
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = "";
        public string DatabaseName { get; set; } = "";
        public string UsersCollection { get; set; } = "";
        public string ProductsCollection { get; set; } = "";
        public string OrdersCollection { get; set; } = "";
    }
}