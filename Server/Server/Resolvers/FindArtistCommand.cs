using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using HotChocolate.Resolvers;
using Server.Models;
using DiscogsClient;
using System.Collections.Generic;
using DiscogsClient.Data.Query;
using System.Linq;

namespace Server.Resolvers
{
    public class FindArtistCommand : IFunction<IReadOnlyList<Artist>>
    {
        public FindArtistCommand(string artistName)
        {
            ArtistName = artistName;
        }

        public string ArtistName { get; }

        public class FindArtistCommandHandler
            : IFunctionHandlerAsync<FindArtistCommand, IReadOnlyList<Artist>>
        {
            private readonly IDiscogsDataBaseClient discogsClient;

            public FindArtistCommandHandler(IDiscogsDataBaseClient discogsClient)
            {
                this.discogsClient = discogsClient;
            }

            public async Task<IReadOnlyList<Artist>> ExecuteAsync(FindArtistCommand command)
            {
                var results = discogsClient
                    .SearchAsEnumerable(new DiscogsSearch {
                        query = command.ArtistName,
                        type = DiscogsEntityType.artist
                    })
                    .ToAsyncEnumerable();

                return await results
                    .Select(result => new Artist {
                        Id = result.id,
                        Name = result.title
                    })
                    .ToList();
            }
        }
    }
}