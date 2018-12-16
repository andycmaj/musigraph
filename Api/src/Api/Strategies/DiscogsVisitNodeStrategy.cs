using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using DiscogsClient;
using DiscogsClient.Data.Result;
using MoreLinq;

namespace Api.Strategies
{
    public class DiscogsVisitNodeStrategy : IVisitNodeStrategy
    {
        private readonly IDiscogsDataBaseClient discogsClient;

        public DiscogsVisitNodeStrategy(IDiscogsDataBaseClient discogsClient)
        {
            this.discogsClient = discogsClient;
        }

        public async Task<AdjacentNodesResult> VisitNode(string nodeId, NodeType nodeType, int maxAdjacentNodes = 100)
        {
            var discogsNodeId = int.Parse(nodeId);

            switch (nodeType)
            {
                case NodeType.Artist:
                    return await GetAdjacentReleases(discogsNodeId, maxAdjacentNodes);
                case NodeType.Release:
                    return await GetAdjacentArtists(discogsNodeId, maxAdjacentNodes);
                default:
                    throw new NotImplementedException($"Unknown NodeType: {nodeType}");
            }
        }

        private async Task<AdjacentNodesResult> GetAdjacentReleases(int artistId, int maxAdjacentNodes)
        {
            var artist = await discogsClient.GetArtistAsync(artistId);

            var releases = await discogsClient
                .GetArtistReleaseAsEnumerable(artistId, max: maxAdjacentNodes)
                .ToAsyncEnumerable()
                .Select(release => new Release {
                    DataSource = "Discogs",
                    Name = release.title,
                    MainArtist = release.artist,
                    ThumbnailUrl = release.thumb,
                    Id = release.GetReleaseId(),
                    InfoUrl = release.GetInfoUrl()
                })
                .ToList();

            return new AdjacentNodesResult {
                Source = new Artist {
                    DataSource = "Discogs",
                    Id = artist.id.ToString(),
                    Name = artist.name
                },
                Nodes = releases
            };
        }

        private async Task<AdjacentNodesResult> GetAdjacentArtists(int releaseId, int maxAdjacentNodes)
        {
            var release = await discogsClient
                .GetReleaseAsync(releaseId);

            var artists = (release.artists ?? new DiscogsReleaseArtist[0])
                .Concat(release.extraartists)
                .Take(maxAdjacentNodes)
                .DistinctBy(artist => artist.id)
                .Select(artist => new Artist {
                    DataSource = "Discogs",
                    Name = artist.name,
                    Id = artist.id.ToString(),
                    Role = artist.role,
                    InfoUrl = artist.GetInfoUrl()
                })
                .ToList();

            return new AdjacentNodesResult {
                Source = new Release {
                    DataSource = "Discogs",
                    Id = release.id.ToString(),
                    Name = release.title
                },
                Nodes = artists
            };
        }
    }
}