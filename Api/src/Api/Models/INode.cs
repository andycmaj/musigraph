using System.Collections.Generic;

namespace Api.Models
{
    public interface INode
    {
        NodeType Type { get; }
        int Id { get; }
        string Name { get; }
        string ThumbnailUrl { get; }
        string InfoUrl { get; }
        IReadOnlyList<INode> AdjacentNodes { get; }
    }
}