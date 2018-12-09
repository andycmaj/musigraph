using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using Api.Models;
using DiscogsClient;
using System.Collections.Generic;
using DiscogsClient.Data.Query;
using System.Linq;
using DiscogsClient.Data.Result;

namespace Api.Commands
{
    public class FindNodeCommand : IFunction<IReadOnlyList<INode>>
    {
        public string Query { get; set; }
        public NodeType Type { get; set; } = NodeType.Artist;

        public class FindNodeCommandHandler
            : IFunctionHandlerAsync<FindNodeCommand, IReadOnlyList<INode>>
        {
            private readonly IDiscogsDataBaseClient discogsClient;

            public FindNodeCommandHandler(IDiscogsDataBaseClient discogsClient)
            {
                this.discogsClient = discogsClient;
            }

            public async Task<IReadOnlyList<INode>> ExecuteAsync(FindNodeCommand command)
            {
                var results = discogsClient
                    .SearchAsEnumerable(
                        new DiscogsSearch
                        {
                            query = command.Query,
                            type = command.Type.ToDiscogsType()
                        },
                        100
                    )
                    .ToAsyncEnumerable();

                return await results
                    .Select(ConvertSearchResultToNode)
                    .ToList();
            }

            private static INode ConvertSearchResultToNode(DiscogsSearchResult result)
            {
                return result.type == DiscogsEntityType.artist
                    ? (INode) new Artist {
                        Id = result.id,
                        Name = result.title,
                        ThumbnailUrl = result.thumb,
                    }
                    : (INode) new Release {
                        Id = result.id,
                        Name = result.title,
                        ThumbnailUrl = result.thumb
                    };
            }
        }
    }
}