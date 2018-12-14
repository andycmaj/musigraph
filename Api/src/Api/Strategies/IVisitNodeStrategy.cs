using System.Threading.Tasks;
using Api.Models;

namespace Api.Strategies
{
    public interface IVisitNodeStrategy
    {
        Task<AdjacentNodesResult> VisitNode(string nodeId, NodeType nodeType, int maxAdjacentNodes = 100);
    }
}