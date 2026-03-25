using MongoDB.Driver;
using WebApplication2.Models;
using Microsoft.Extensions.Options;

namespace WebApplication2.Services
{
    public class ProductMongoService
    {
        private readonly IMongoCollection<Product> _products;

        public ProductMongoService(
            IMongoClient client,
            IOptions<MongoSettings> settings)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _products = database.GetCollection<Product>(settings.Value.ProductsCollection);
        }

        public async Task<List<Product>> GetAllAsync()
        {
            var products = await _products.Find(_ => true).ToListAsync();

            foreach (var p in products)
            {
                p.Rating = p.Reviews.Count > 0
                    ? Math.Round(p.Reviews.Average(r => r.Rating), 1)
                    : p.BaseRating;
            }

            return products;
        }

        public async Task<Product?> GetByIdAsync(string id)
        {
            var product = await _products.Find(x => x.Id == id).FirstOrDefaultAsync();

            if (product != null)
            {
                product.Rating = product.Reviews.Count > 0
                    ? Math.Round(product.Reviews.Average(r => r.Rating), 1)
                    : product.BaseRating;
            }

            return product;
        }

        public async Task CreateAsync(Product product) =>
            await _products.InsertOneAsync(product);

        public async Task UpdateAsync(string id, Product updatedProduct) =>
            await _products.ReplaceOneAsync(x => x.Id == id, updatedProduct);

        public async Task DeleteAsync(string id) =>
            await _products.DeleteOneAsync(x => x.Id == id);

        public async Task<Product?> AddReviewAsync(string productId, Review review)
        {
            var product = await _products.Find(x => x.Id == productId).FirstOrDefaultAsync();

            if (product == null) return null;

            product.Reviews.Add(review);

            product.Rating = product.Reviews.Count > 0
                ? Math.Round(product.Reviews.Average(r => r.Rating), 1)
                : 0;

            await _products.ReplaceOneAsync(x => x.Id == productId, product);

            return product;
        }

        public async Task SeedProductsAsync()
        {
            var existing = await _products.Find(_ => true).AnyAsync();

            if (existing) return;

            var products = new List<Product>
            {
                new Product {
                    Name = "Навушники Logitech G522 Lightspeed Black",
                    Category = "Навушники",
                    ImageUrl = "https://content.rozetka.com.ua/goods/images/big/549096330.jpg",
                    Rating = 0,
                    BaseRating = 5,
                    PriceEth = 0.15m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Пластик",
                        Color = "Чорний",
                        Quantity = 10,
                        Seller = "Rozetka"
                    }
                },
                new Product {
                    Name = "Портативна бездротова Bluetooth HOPESTAR H90",
                    Category = "Портативні колонки",
                    ImageUrl = "https://content.rozetka.com.ua/goods/images/big/654145783.jpg",
                    Rating = 0,
                    BaseRating = 4,
                    PriceEth = 0.18m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Пластик, тканина",
                        Color = "Чорний",
                        Quantity = 7,
                        Seller = "Rozetka"
                    }
                },
                new Product {
                    Name = "Акустична система Real-El M-555 Black",
                    Category = "Акустичні системи",
                    ImageUrl = "https://content2.rozetka.com.ua/goods/images/big/424843146.jpg",
                    Rating = 0,
                    BaseRating = 4,
                    PriceEth = 0.25m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Дерево",
                        Color = "Чорний",
                        Quantity = 3,
                        Seller = "Rozetka"
                    }
                },
                new Product {
                    Name = "Програвач вінілових дисків Muse MT-201 BTG Тауп",
                    Category = "Програвачі вінілу",
                    ImageUrl = "https://content.rozetka.com.ua/goods/images/big/421047509.jpg",
                    Rating = 0,
                    BaseRating = 3,
                    PriceEth = 0.22m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Метал",
                        Color = "Сірий",
                        Quantity = 5,
                        Seller = "Rozetka"
                    }
                },
                new Product {
                    Name = "Мікшерний пульт Fifine Sound Card (SC3) Black",
                    Category = "Про-аудіо",
                    ImageUrl = "https://content.rozetka.com.ua/goods/images/big/356718109.jpg",
                    Rating = 0,
                    BaseRating = 4,
                    PriceEth = 0.35m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Пластик",
                        Color = "Сірий",
                        Quantity = 4,
                        Seller = "Rozetka"
                    }
                },
                new Product {
                    Name = "DJ-контролер PIONEER DDJ-FLX4",
                    Category ="DJ-обладнання",
                    ImageUrl = "https://content1.rozetka.com.ua/goods/images/big/643723043.jpg",
                    Rating = 0,
                    BaseRating = 5,
                    PriceEth = 0.12m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Пластик",
                        Color = "Чорний",
                        Quantity = 1,
                        Seller = "Rozetka"
                    }
                },
                new Product {
                    Name = "Медіаплеєр RZTK TV Box X98 Plus",
                    Category = "Медіаплеєри",
                    ImageUrl = "https://content.rozetka.com.ua/goods/images/big/598104206.jpg",
                    Rating = 0,
                    BaseRating = 5,
                    PriceEth = 0.17m,
                    Description = "Якісні бездротові навушники для геймінгу",
                    InStock = true,
                    Specs = new ProductSpecs
                    {
                        Material = "Пластик",
                        Color = "Чорний",
                        Quantity = 10,
                        Seller = "Rozetka"
                    }
                }
            };

            await _products.InsertManyAsync(products);
        }
    }
}