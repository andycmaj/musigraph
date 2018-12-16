using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Models;

namespace Api.Strategies
{
    public class SpotifySearchStrategy : ISearchStrategy
    {
        private readonly SpotifyWebAPI spotify;

        public SpotifySearchStrategy(SpotifyWebAPI spotify)
        {
            this.spotify = spotify;
        }

        public async Task<IReadOnlyList<INode>> SearchAsync(string query, NodeType type)
        {
            var results = await spotify.SearchItemsAsync(query, type.ToSpotifyType(), limit: 50);

            return
                (type == NodeType.Artist
                    ? results.Artists.Items.Select(ConvertResultToNode)
                    : results.Albums.Items.Select(ConvertResultToNode)
                )
                .ToList();
        }

        private static INode ConvertResultToNode(FullArtist result)
        {
            return new Artist {
                DataSource = "Spotify",
                Id = result.Id,
                Name = result.Name,
                ThumbnailUrl = result.Images.FirstOrDefault()?.Url,
                InfoUrl = result.ExternalUrls.FirstOrDefault().Value
            };
        }

        private static INode ConvertResultToNode(SimpleAlbum result)
        {
            return new Release {
                DataSource = "Spotify",
                Id = result.Id,
                Name = result.Name,
                ThumbnailUrl = result.Images.FirstOrDefault()?.Url,
                InfoUrl = result.ExternalUrls.FirstOrDefault().Value
            };
        }
    }
}