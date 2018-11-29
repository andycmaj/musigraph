using System.Collections.Generic;

namespace Api.Models
{
    public class AdjacentNodesResult
    {
        public INode Source { get; set; }
        public IReadOnlyList<INode> Nodes { get; set; }
    }
}