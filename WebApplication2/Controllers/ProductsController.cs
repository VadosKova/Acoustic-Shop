using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductMongoService _service;

        public ProductsController(ProductMongoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _service.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var product = await _service.GetByIdAsync(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            await _service.CreateAsync(product);
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Product updated)
        {
            var existing = await _service.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            updated.Id = existing.Id;

            await _service.UpdateAsync(id, updated);

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _service.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            await _service.DeleteAsync(id);

            return Ok();
        }

        [HttpPost("{id}/review")]
        public async Task<IActionResult> AddReview(string id, [FromBody] Review review)
        {
            var updatedProduct = await _service.AddReviewAsync(id, review);

            if (updatedProduct == null)
                return NotFound();

            return Ok(updatedProduct);
        }

        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetReviews(string id)
        {
            var product = await _service.GetByIdAsync(id);

            if (product == null)
                return NotFound();

            return Ok(product.Reviews);
        }
    }
}