
using AspNetCore.ApplicationBlocks.Configuration;

namespace Api
{
    public interface IAppConfig : IApplicationConfiguration
    {
        string DiscogsApiToken { get; }
    }
}