using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(ProductService.Products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = ProductService.Products
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public IActionResult Create(Product product)
        {
            product.Id = ProductService.Products.Count + 1;
            ProductService.Products.Add(product);
            return Ok(product);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Product updated)
        {
            var product = ProductService.Products.FirstOrDefault(x => x.Id == id);

            if (product == null)
                return NotFound();

            product.Name = updated.Name;
            product.PriceEth = updated.PriceEth;
            product.ImageUrl = updated.ImageUrl;
            product.Category = updated.Category;

            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = ProductService.Products.FirstOrDefault(x => x.Id == id);

            if (product == null)
                return NotFound();

            ProductService.Products.Remove(product);

            return Ok();
        }
    }
}
