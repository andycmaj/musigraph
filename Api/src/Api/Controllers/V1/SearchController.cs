using System.Threading.Tasks;
using Api.Commands;
using AspNetCore.ApplicationBlocks.Commands;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.V1
{
    [Route("api/v1/[controller]")]
    public class SearchController : Controller
    {
        private readonly ICommandRouter commandRouter;

        public SearchController(ICommandRouter commandRouter)
        {
            this.commandRouter = commandRouter;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FindNodeCommand command)
        {
            var result = await commandRouter.ExecuteFunctionAsync(command);

            return Ok(result);
        }
    }
}
