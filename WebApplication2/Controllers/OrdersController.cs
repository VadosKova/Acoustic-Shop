using Microsoft.AspNetCore.Mvc;
using WebApplication2.Models;
using WebApplication2.Services;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderMongoService _service;

        public OrdersController(OrderMongoService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Order order)
        {
            await _service.CreateAsync(order);
            return Ok(order);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(string userId)
        {
            var orders = await _service.GetByUserAsync(userId);
            return Ok(orders);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllAsync();
            return Ok(orders);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] string status)
        {
            await _service.UpdateStatusAsync(id, status);
            return Ok();
        }
    }
}