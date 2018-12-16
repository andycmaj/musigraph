using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using Microsoft.AspNetCore.Mvc;
using Api.Commands;

namespace Api.Controllers
{
    [Route("api/v1/[controller]")]
    public class NodesController : Controller
    {
        private readonly ICommandRouter commandRouter;

        public NodesController(ICommandRouter commandRouter)
        {
            this.commandRouter = commandRouter;
        }

        [HttpGet]
        public async Task<IActionResult> GetAdjacentNodes([FromQuery] GetAdjacentNodesCommand command)
        {
            var result = await commandRouter.ExecuteFunctionAsync(command);

            return Ok(result);
        }

        [HttpGet("actions")]
        public async Task<IActionResult> GetActions([FromQuery] GetNodeActionsCommand command)
        {
            var result = await commandRouter.ExecuteFunctionAsync(command);

            return Ok(result);
        }
    }
}