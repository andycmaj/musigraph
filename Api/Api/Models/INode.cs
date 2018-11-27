using System.Collections.Generic;

namespace Api.Models
{
    public interface INode
    {
        NodeType Type { get; }
        int Id { get; }
        string Name { get; }
        IReadOnlyList<INode> AdjacentNodes { get; }
    }
}