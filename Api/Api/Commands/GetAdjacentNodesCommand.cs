using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using DiscogsClient;
using Api.Models;
using System;

namespace Api.Commands
{
    public class GetAdjacentNodesCommand : IFunction<IReadOnlyList<INode>>
    {
        public int NodeId { get; set; }
        public NodeType NodeType { get; set; }

        public class GetAdjacentNodesCommandHandler
            : IFunctionHandlerAsync<GetAdjacentNodesCommand, IReadOnlyList<INode>>
        {
            private readonly IDiscogsDataBaseClient discogsClient;

            public GetAdjacentNodesCommandHandler(IDiscogsDataBaseClient discogsClient)
            {
                this.discogsClient = discogsClient;
            }

            public async Task<IReadOnlyList<INode>> ExecuteAsync(GetAdjacentNodesCommand command)
            {
                switch (command.NodeType)
                {
                    case NodeType.Artist:
                        return await GetAdjacentReleases(command.NodeId);
                    case NodeType.Release:
                        return await GetAdjacentArtists(command.NodeId);
                    default:
                        throw new NotImplementedException($"Unknown NodeType: {command.NodeType}");
                }
            }

            private async Task<IReadOnlyList<INode>> GetAdjacentReleases(int artistId)
            {
                var releases = discogsClient
                    .GetArtistReleaseAsEnumerable(artistId)
                    .ToAsyncEnumerable();

                return await releases
                    .Select(release => new Release {
                        Name = release.title,
                        MainArtist = release.artist,
                        Id = release.id
                    })
                    .ToList();
            }

            private async Task<IReadOnlyList<INode>> GetAdjacentArtists(int releaseId)
            {
                var release = await discogsClient
                    .GetReleaseAsync(releaseId);

                return release
                    .artists
                    .Concat(release.extraartists)
                    .Select(artist => new Artist {
                        Name = artist.name,
                        Id = artist.id,
                        Role = artist.role
                    })
                    .ToList();
            }
        }
    }
}