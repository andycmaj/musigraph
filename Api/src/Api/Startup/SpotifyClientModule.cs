using Api.Strategies;
using AspNetCore.ApplicationBlocks.DependencyInjection;
using SimpleInjector;
using SpotifyAPI.Web;
using SpotifyAPI.Web.Auth;

namespace Api.Startup
{
    public class SpotifyClientModule : IModule
    {
        public void RegisterServices(Container container)
        {
            container.RegisterSingleton<SpotifyWebAPI>(() =>
            {
                var config = container.GetInstance<IAppConfig>();

                return new SpotifyWebAPI
                {
                    UseAuth = true,
                    TokenType = "Bearer",
                    AccessToken = "BQBacEmP8aI3HZWnako8Yd9cexltx4-P3O98O83tkUoxBF-djsiag22PVq7YFN6NDDQ6m-xot0Bkr_EXJPM_2v_MZzcaBti74yHA1akALEe-pfF4uQ0JVDCX9dgQ2_WF5Ivqy1Ic6_GZlWVP95v7mwA8mefU2qZONkrBFLALn0bZKdNW2QrF5fyeNAVOiRd3k1Y_9BPIYbVflEJsQyEylxX1tEAprXOHlVA3YrH4-0VkbQzRDGpEz4JrBDYe5kQbBzajPfI49Jj4r71Z1w"
                };
            });

            container.Register<SpotifySearchStrategy>();
            // container.Register<SpotifyVi>();
        }
    }
}