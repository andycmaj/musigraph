using Api.Strategies;
using AspNetCore.ApplicationBlocks.DependencyInjection;
using DiscogsClient;
using DiscogsClient.Internal;
using SimpleInjector;

namespace Api.Startup
{
    public class DiscogsClientModule : IModule
    {
        public void RegisterServices(Container container)
        {
            container.RegisterSingleton<IDiscogsDataBaseClient>(() => {
                // Create authentication based on Discogs token
                var token = container.GetInstance<IAppConfig>().DiscogsApiToken;
                var tokenInformation = new TokenAuthenticationInformation(token);
                //Create discogs client using the authentication
                return new DiscogsClient.DiscogsClient(tokenInformation, "foo", 5000);
            });

            container.Register<DiscogsSearchStrategy>();
            container.Register<DiscogsVisitNodeStrategy>();
        }
    }
}