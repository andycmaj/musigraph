using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using DiscogsClient;
using Server.Models;

namespace Server.Resolvers
{
    public class ResolvePerformsOnCommand : IFunction<IReadOnlyList<Release>>
    {
        public ResolvePerformsOnCommand(int artistId)
        {
            ArtistId = artistId;
        }

        public int ArtistId { get; }

        public class ResolvePerformsOnCommandHandler
            : IFunctionHandlerAsync<ResolvePerformsOnCommand, IReadOnlyList<Release>>
        {
            private readonly IDiscogsDataBaseClient discogsClient;

            public ResolvePerformsOnCommandHandler(IDiscogsDataBaseClient discogsClient)
            {
                this.discogsClient = discogsClient;
            }

            public async Task<IReadOnlyList<Release>> ExecuteAsync(ResolvePerformsOnCommand command)
            {
                var releases = discogsClient
                    .GetArtistReleaseAsEnumerable(command.ArtistId)
                    .ToAsyncEnumerable();

                return await releases
                    .Select(release => new Release {
                        Name = release.title,
                        MainArtist = release.artist,
                        Id = release.id
                    })
                    .ToList();
            }
        }
    }
}