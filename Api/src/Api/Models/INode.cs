using System.Collections.Generic;

namespace Api.Models
{
    public interface INode
    {
        string DataSource { get; }
        NodeType Type { get; }
        string Id { get; }
        string Name { get; }
        string ThumbnailUrl { get; }
        string InfoUrl { get; }
        IReadOnlyList<INode> AdjacentNodes { get; }
    }
}