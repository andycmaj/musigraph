﻿using System.Threading.Tasks;
using Api.Commands;
using AspNetCore.ApplicationBlocks.Commands;
using Microsoft.AspNetCore.Mvc;

namespace Iqviate.Templates.FrontEnd.Controllers.V1
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
        public async Task<IActionResult> Get([FromQuery] FindArtistCommand command)
        {
            var result = await commandRouter.ExecuteFunctionAsync(command);

            return Ok(result);
        }
    }
}