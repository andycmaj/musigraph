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
            // Create authentication based on Discogs token
            var tokenInformation = new TokenAuthenticationInformation("zIULkphvrIkPidoMnMLNUbiEESbBsiMOPbuvUiCK");
            //Create discogs client using the authentication
            var discogsClient = new DiscogsClient.DiscogsClient(tokenInformation, "foo", 5000);

            container.RegisterInstance<IDiscogsDataBaseClient>(discogsClient);
        }
    }
}