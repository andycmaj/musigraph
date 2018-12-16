using System.Collections.Generic;
using System.Threading.Tasks;
using SpotifyAPI.Web.Models;

namespace Api
{
    public interface ISpotify
    {
        Task<IList<SimpleAlbum>> FindAlbumsAsync(string title, string artist);

        Task<IList<FullArtist>> FindArtistsAsync(string name);

        Task<IList<SimpleTrack>> GetAlbumTracksAsync(string albumId, int limit = 10);

        Task<IList<FullTrack>> GetArtistTopTracksAsync(string albumId, int limit = 10);
    }
}