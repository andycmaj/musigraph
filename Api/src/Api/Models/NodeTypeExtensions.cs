using System;
using DiscogsClient.Data.Query;
using SpotifyAPI.Web.Enums;

namespace Api.Models
{
    public static class NodeTypeExtensions
    {
        public static DiscogsEntityType ToDiscogsType(this NodeType nodeType)
        {
            switch (nodeType)
            {
                case NodeType.Artist:
                    return DiscogsEntityType.artist;
                case NodeType.Release:
                    return DiscogsEntityType.release;
                default:
                    throw new NotImplementedException($"Unknown NodeType: {nodeType}");
            }
        }

        public static SearchType ToSpotifyType(this NodeType nodeType)
        {
            switch (nodeType)
            {
                case NodeType.Artist:
                    return SearchType.Artist;
                case NodeType.Release:
                    return SearchType.Album;
                default:
                    throw new NotImplementedException($"Unknown NodeType: {nodeType}");
            }
        }
    }
}