using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using Api.Models;
using Api.Strategies;

namespace Api.Commands
{
    public class GetAdjacentNodesCommand : IFunction<AdjacentNodesResult>
    {
        // TODO: paging
        private const int MaxResults = 100;

        public int NodeId { get; set; }
        public NodeType NodeType { get; set; }

        public class GetAdjacentNodesCommandHandler
            : IFunctionHandlerAsync<GetAdjacentNodesCommand, AdjacentNodesResult>
        {
            private readonly IStrategyFactory strategyFactory;

            public GetAdjacentNodesCommandHandler(IStrategyFactory strategyFactory)
            {
                this.strategyFactory = strategyFactory;
            }

            public async Task<AdjacentNodesResult> ExecuteAsync(GetAdjacentNodesCommand command)
            {
                var visitor = strategyFactory.GetVisitNodeStrategy();
                return await visitor.VisitNode(command.NodeId.ToString(), command.NodeType, MaxResults);
            }
        }
    }
}