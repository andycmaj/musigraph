using System.Linq;
using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Commands;
using DiscogsClient;
using Api.Models;
using System;
using MoreLinq;
using DiscogsClient.Data.Result;

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
            private readonly IDiscogsDataBaseClient discogsClient;

            public GetAdjacentNodesCommandHandler(IDiscogsDataBaseClient discogsClient)
            {
                this.discogsClient = discogsClient;
            }

            public async Task<AdjacentNodesResult> ExecuteAsync(GetAdjacentNodesCommand command)
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

            private async Task<AdjacentNodesResult> GetAdjacentReleases(int artistId)
            {
                var artist = await discogsClient.GetArtistAsync(artistId);

                var releases = await discogsClient
                    .GetArtistReleaseAsEnumerable(artistId, max: MaxResults)
                    .ToAsyncEnumerable()
                    .Select(release => new Release {
                        Name = release.title,
                        MainArtist = release.artist,
                        ThumbnailUrl = release.thumb,
                        Id = release.type == "master"
                            ? release.main_release
                            : release.id
                    })
                    .ToList();

                return new AdjacentNodesResult {
                    Source = new Artist {
                        Id = artist.id,
                        Name = artist.name
                    },
                    Nodes = releases
                };
            }

            private async Task<AdjacentNodesResult> GetAdjacentArtists(int releaseId)
            {
                var release = await discogsClient
                    .GetReleaseAsync(releaseId);

                var artists = (release.artists ?? new DiscogsReleaseArtist[0])
                    .Concat(release.extraartists)
                    .Take(MaxResults)
                    .DistinctBy(artist => artist.id)
                    .Select(artist => new Artist {
                        Name = artist.name,
                        Id = artist.id,
                        Role = artist.role,
                    })
                    .ToList();

                return new AdjacentNodesResult {
                    Source = new Release {
                        Id = release.id,
                        Name = release.title
                    },
                    Nodes = artists
                };
            }
        }
    }
}