using System;
using DiscogsClient.Data.Query;

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
    }
}