using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using Api.Models;
using System.Collections.Generic;
using Api.Strategies;

namespace Api.Commands
{
    public class FindNodeCommand : IFunction<IReadOnlyList<INode>>
    {
        public string Query { get; set; }
        public NodeType Type { get; set; } = NodeType.Artist;

        public class FindNodeCommandHandler
            : IFunctionHandlerAsync<FindNodeCommand, IReadOnlyList<INode>>
        {
            private readonly IStrategyFactory strategyFactory;

            public FindNodeCommandHandler(IStrategyFactory strategyFactory)
            {
                this.strategyFactory = strategyFactory;
            }

            public async Task<IReadOnlyList<INode>> ExecuteAsync(FindNodeCommand command)
            {
                var searchStrategy = strategyFactory.GetSearchStrategy();
                return await searchStrategy.SearchAsync(command.Query, command.Type);
            }
        }
    }
}