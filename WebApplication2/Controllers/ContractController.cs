using Microsoft.AspNetCore.Mvc;
using Nethereum.Web3;
using System.Numerics;
using WebApplication2.Blockchain;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/contract")]
    public class ContractController : ControllerBase
    {
        private readonly Web3 _web3;
        private readonly IConfiguration _cfg;

        public ContractController(Web3 web3, IConfiguration cfg)
        {
            _web3 = web3;
            _cfg = cfg;
        }

        [HttpGet("info")]
        public async Task<IActionResult> Info()
        {
            var address = _cfg["Blockchain:ContractAddress"];
            var handler = _web3.Eth.GetContractHandler(address);

            var owner = await handler.QueryAsync<OwnerFunction, string>(new());
            var balance = await handler.QueryAsync<GetBalanceFunction, BigInteger>(new());

            return Ok(new
            {
                contractAddress = address,
                owner,
                balanceWei = balance.ToString()
            });
        }
    }
}
