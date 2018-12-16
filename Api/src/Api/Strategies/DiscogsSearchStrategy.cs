using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using DiscogsClient;
using DiscogsClient.Data.Query;
using DiscogsClient.Data.Result;

namespace Api.Strategies
{
    public class DiscogsSearchStrategy : ISearchStrategy
    {
        private readonly IDiscogsDataBaseClient discogsClient;

        public DiscogsSearchStrategy(IDiscogsDataBaseClient discogsClient)
        {
            this.discogsClient = discogsClient;
        }

        public async Task<IReadOnlyList<INode>> SearchAsync(string query, NodeType type)
        {
            var results = discogsClient
                .SearchAsEnumerable(
                    new DiscogsSearch
                    {
                        query = query,
                        type = type.ToDiscogsType()
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
                    DataSource = "Discogs",
                    Id = result.id.ToString(),
                    Name = result.title,
                    ThumbnailUrl = result.thumb,
                    InfoUrl = $"https://www.discogs.com/artist/{result.id}"
                }
                : (INode) new Release {
                    DataSource = "Discogs",
                    Id = result.id.ToString(),
                    Name = result.title,
                    ThumbnailUrl = result.thumb,
                    InfoUrl = $"https://www.discogs.com/release/{result.id}"
                };
        }
    }
}