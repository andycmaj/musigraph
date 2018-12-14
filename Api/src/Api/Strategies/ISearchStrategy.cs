using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Models;

namespace Api.Strategies
{
    public interface ISearchStrategy
    {
        Task<IReadOnlyList<INode>> SearchAsync(string query, NodeType type);
    }
}