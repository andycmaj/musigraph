using System.Collections.Generic;

namespace Api.Models
{
    public class Release : INode
    {
        public NodeType Type { get; } = NodeType.Release;
        public string Id { get; set; }
        public string Name { get; set; }
        public string MainArtist { get; set; }
        public IReadOnlyList<Artist> Performers { get; set; }
        public IReadOnlyList<INode> AdjacentNodes => Performers;
        public string ThumbnailUrl { get; set; }
        public string InfoUrl { get; set; }
        public string DataSource { get; set; }
        public string Subtitle => MainArtist;
    }
}