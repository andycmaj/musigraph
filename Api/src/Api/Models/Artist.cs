using System.Collections.Generic;

namespace Api.Models
{
    public class Artist : INode
    {
        public NodeType Type { get; } = NodeType.Artist;
        public int Id { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public IReadOnlyList<Release> PerformsOn { get; set; }
        public IReadOnlyList<INode> AdjacentNodes => PerformsOn;
        public string ThumbnailUrl { get; set; }
        public string InfoUrl => $"https://www.discogs.com/artist/{Id}";
    }
}