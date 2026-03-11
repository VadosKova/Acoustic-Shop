using WebApplication2.Models;

namespace WebApplication2.Services
{
    public static class ProductService
    {
        public static readonly List<Product> Products = new()
        {
            new Product {
                Id = 1,
                Name = "Навушники Logitech G522 Lightspeed Black",
                Category = "Навушники",
                ImageUrl = "https://content.rozetka.com.ua/goods/images/big/549096330.jpg",
                Rating = 4.8,
                PriceEth = 0.15m
            },
            new Product {
                Id = 2,
                Name = "Портативна бездротова Bluetooth HOPESTAR H90",
                Category = "Портативні колонки",
                ImageUrl = "https://content.rozetka.com.ua/goods/images/big/654145783.jpg",
                Rating = 4.6,
                PriceEth = 0.18m
            },
            new Product {
                Id = 3,
                Name = "Акустична система Real-El M-555 Black",
                Category = "Акустичні системи",
                ImageUrl = "https://content2.rozetka.com.ua/goods/images/big/424843146.jpg",
                Rating = 4.9,
                PriceEth = 0.25m
            },
            new Product {
                Id = 4,
                Name = "Програвач вінілових дисків Muse MT-201 BTG Тауп",
                Category = "Програвачі вінілу",
                ImageUrl = "https://content.rozetka.com.ua/goods/images/big/421047509.jpg",
                Rating = 4.7,
                PriceEth = 0.22m
            },
            new Product {
                Id = 5,
                Name = "Мікшерний пульт Fifine Sound Card (SC3) Black",
                Category = "Про-аудіо",
                ImageUrl = "https://content.rozetka.com.ua/goods/images/big/356718109.jpg",
                Rating = 4.3,
                PriceEth = 0.35m
            },
            new Product {
                Id = 6,
                Name = "DJ-контролер PIONEER DDJ-FLX4",
                Category ="DJ-обладнання",
                ImageUrl = "https://content1.rozetka.com.ua/goods/images/big/643723043.jpg",
                Rating = 4.5,
                PriceEth = 0.12m
            },
            new Product {
                Id = 7,
                Name = "Медіаплеєр RZTK TV Box X98 Plus",
                Category = "Медіаплеєри",
                ImageUrl = "https://content.rozetka.com.ua/goods/images/big/598104206.jpg",
                Rating = 4.6,
                PriceEth = 0.17m
            }
        };
    }
}
