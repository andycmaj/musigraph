
using AspNetCore.ApplicationBlocks.Configuration;

namespace Api
{
    public interface IAppConfig : IApplicationConfiguration
    {
        string DataSource { get; }

        string DiscogsApiToken { get; }

        string SpotifyClientId { get; }

        string SpotifyClientSecret { get; }

        string CookieDomain { get; }
    }
}